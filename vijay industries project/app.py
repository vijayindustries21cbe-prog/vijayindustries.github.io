"""
Flask Application for Vijay Industries Website
Serves static files and provides API endpoints for contact forms
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
import os
import json
from datetime import datetime
import logging
from logging import Filter

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Suppress favicon 404 errors in logs
class FaviconFilter(Filter):
    def filter(self, record):
        return '/favicon.ico' not in record.getMessage()

logging.getLogger('werkzeug').addFilter(FaviconFilter())

# Determine the correct path for static files
# Handle both local development and Vercel serverless environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# In Vercel, the function runs from /api, so we need to go up one level
if '/api' in BASE_DIR or BASE_DIR.endswith('api'):
    CODE_DIR = os.path.join(os.path.dirname(BASE_DIR), 'code')
else:
    CODE_DIR = os.path.join(BASE_DIR, 'code')

# Check if code directory exists, if not try alternatives
if not os.path.exists(CODE_DIR):
    # Try parent directory
    CODE_DIR = os.path.join(os.path.dirname(BASE_DIR), 'code')
if not os.path.exists(CODE_DIR):
    # Fallback: use base directory
    CODE_DIR = BASE_DIR
    logger.warning(f"Code directory not found, using: {CODE_DIR}")

logger.info(f"Serving static files from: {CODE_DIR}")

# Initialize Flask app
app = Flask(__name__, 
            static_folder=CODE_DIR,
            static_url_path='',
            template_folder=CODE_DIR)

# Enable CORS for API endpoints
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Database configuration
# For SQLite (development) - uses local file
# For PostgreSQL (production) - set DATABASE_URL environment variable
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # PostgreSQL or other production database
    if database_url.startswith('postgres://'):
        # Fix for Heroku-style postgres:// URLs
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # SQLite for local development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vijay_industries.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

# Database Models
class Contact(db.Model):
    """Contact model for storing contact form submissions and quote requests"""
    __tablename__ = 'contacts'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    phone = Column(String(50))
    subject = Column(String(200))
    message = Column(Text)
    service_type = Column(String(100))
    type = Column(String(50), default='contact')  # 'contact' or 'quote_request'
    transformer_type = Column(String(200))  # For quote requests
    specifications = Column(Text)  # For quote requests
    quantity = Column(String(50))  # For quote requests
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        """Convert contact to dictionary format"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'subject': self.subject,
            'message': self.message,
            'service_type': self.service_type,
            'type': self.type,
            'transformer_type': self.transformer_type,
            'specifications': self.specifications,
            'quantity': self.quantity,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }
    
    def __repr__(self):
        return f'<Contact {self.id}: {self.name} ({self.email})>'

# Initialize database tables
with app.app_context():
    try:
        db.create_all()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")

# Legacy JSON file path (for migration purposes)
DATA_DIR = 'data'
CONTACTS_FILE = os.path.join(DATA_DIR, 'contacts.json')


def migrate_json_to_db():
    """Migrate existing JSON contacts to database (one-time migration)"""
    try:
        if not os.path.exists(CONTACTS_FILE):
            logger.info("No JSON contacts file found, skipping migration")
            return
        
        with open(CONTACTS_FILE, 'r') as f:
            json_contacts = json.load(f)
        
        if not json_contacts:
            logger.info("No contacts in JSON file to migrate")
            return
        
        migrated_count = 0
        skipped_count = 0
        
        for contact in json_contacts:
            try:
                # Check if contact already exists (by email and timestamp if available)
                email = contact.get('email', '').strip()
                if not email:
                    skipped_count += 1
                    continue
                
                # Try to find existing contact by email and approximate timestamp
                existing = None
                if contact.get('timestamp'):
                    try:
                        json_timestamp = datetime.fromisoformat(contact.get('timestamp').replace('Z', '+00:00'))
                        # Find contacts with same email and timestamp within 1 second
                        existing = Contact.query.filter_by(email=email).filter(
                            func.abs(func.extract('epoch', Contact.timestamp - json_timestamp)) < 1
                        ).first()
                    except:
                        pass
                
                if not existing:
                    # Create new contact from JSON data
                    db_contact = Contact(
                        name=contact.get('name', '').strip(),
                        email=email,
                        phone=contact.get('phone', '').strip(),
                        subject=contact.get('subject', 'General Inquiry').strip(),
                        message=contact.get('message', '').strip(),
                        service_type=contact.get('service_type', '').strip(),
                        type=contact.get('type', 'contact'),
                        transformer_type=contact.get('transformer_type', '').strip(),
                        specifications=contact.get('specifications', '').strip(),
                        quantity=contact.get('quantity', '').strip()
                    )
                    db.session.add(db_contact)
                    migrated_count += 1
                else:
                    skipped_count += 1
            except Exception as e:
                logger.error(f"Error migrating contact {contact.get('email', 'unknown')}: {str(e)}")
                skipped_count += 1
        
        db.session.commit()
        logger.info(f"Migration complete: {migrated_count} contacts migrated, {skipped_count} skipped")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error during migration: {str(e)}")


def load_contacts():
    """Load contacts from database"""
    try:
        contacts = Contact.query.order_by(Contact.timestamp.desc()).all()
        return [contact.to_dict() for contact in contacts]
    except Exception as e:
        logger.error(f"Error loading contacts from database: {str(e)}")
        return []


def save_contact(contact_data):
    """Save contact submission to database"""
    try:
        contact = Contact(
            name=contact_data.get('name', '').strip(),
            email=contact_data.get('email', '').strip(),
            phone=contact_data.get('phone', '').strip(),
            subject=contact_data.get('subject', 'General Inquiry').strip(),
            message=contact_data.get('message', '').strip(),
            service_type=contact_data.get('service_type', '').strip(),
            type=contact_data.get('type', 'contact'),
            transformer_type=contact_data.get('transformer_type', '').strip(),
            specifications=contact_data.get('specifications', '').strip(),
            quantity=contact_data.get('quantity', '').strip()
        )
        
        db.session.add(contact)
        db.session.commit()
        
        return contact.to_dict()
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error saving contact to database: {str(e)}")
        raise


# Routes
@app.route('/favicon.ico')
def favicon():
    """Handle favicon requests to prevent 404 errors"""
    return '', 204  # Return 204 No Content (standard for missing favicons)


@app.route('/')
def index():
    """Serve the main index.html file"""
    try:
        index_path = os.path.join(CODE_DIR, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(CODE_DIR, 'index.html')
        else:
            # Try using Flask's built-in static file serving
            try:
                return app.send_static_file('index.html')
            except:
                # Last resort: try relative path
                return send_from_directory('.', 'code/index.html')
    except Exception as e:
        logger.error(f"Error serving index.html: {str(e)}")
        logger.error(f"CODE_DIR: {CODE_DIR}, exists: {os.path.exists(CODE_DIR)}")
        return f"Error: index.html not found. CODE_DIR: {CODE_DIR}", 500


@app.route('/<path:path>')
def serve_static(path):
    """Serve static files (CSS, JS, images, etc.)"""
    # Don't handle API routes here
    if path.startswith('api/'):
        return jsonify({'error': 'Not found'}), 404
    
    try:
        file_path = os.path.join(CODE_DIR, path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return send_from_directory(CODE_DIR, path)
        else:
            # Try using Flask's built-in static file serving
            try:
                return app.send_static_file(path)
            except:
                # Try relative path
                return send_from_directory('.', f'code/{path}')
    except Exception as e:
        logger.error(f"Error serving {path}: {str(e)}")
        return "File not found", 404


# API Endpoints
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """
    Handle contact form submissions
    Expected JSON payload:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91 1234567890",
        "subject": "Inquiry",
        "message": "Hello, I need information about transformers"
    }
    """
    try:
        # Accept both JSON and form submissions
        if request.is_json:
            data = request.get_json(silent=True) or {}
        else:
            data = request.form.to_dict()

        if not data:
            logger.error("No data received in contact submission")
            return jsonify({
                'success': False,
                'error': 'No data received'
            }), 400
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Validate email format (basic)
        email = data.get('email', '').strip()
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # Prepare contact data
        contact_data = {
            'name': data.get('name', '').strip(),
            'email': email,
            'phone': data.get('phone', '').strip(),
            'subject': data.get('subject', 'General Inquiry').strip(),
            'message': data.get('message', '').strip(),
            'service_type': data.get('service_type', '').strip()
        }
        
        # Save contact with robust error handling
        try:
            saved_contact = save_contact(contact_data)
        except Exception as save_error:
            logger.error(f"Error saving contact: {str(save_error)}")
            return jsonify({
                'success': True,
                'message': 'Thank you for contacting us! We will get back to you soon.',
                'warning': 'Received your message but could not persist it. Please contact us directly if needed.'
            }), 200
        
        logger.info(f"New contact submission: {saved_contact['name']} ({saved_contact['email']})")
        
        return jsonify({
            'success': True,
            'message': 'Thank you for contacting us! We will get back to you soon.',
            'contact_id': saved_contact.get('id')
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        logger.error(f"Request headers: {dict(request.headers)}")
        logger.error(f"Request method: {request.method}, content-type: {request.content_type}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while processing your request. Please try again later.'
        }), 500


@app.route('/api/quote', methods=['POST'])
def submit_quote():
    """
    Handle quote request submissions
    Expected JSON payload:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91 1234567890",
        "transformer_type": "Distribution Transformer",
        "specifications": "100 kVA, 11kV/415V",
        "quantity": "5",
        "message": "Additional requirements"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Prepare quote data
        quote_data = {
            'name': data.get('name', '').strip(),
            'email': data.get('email', '').strip(),
            'phone': data.get('phone', '').strip(),
            'transformer_type': data.get('transformer_type', '').strip(),
            'specifications': data.get('specifications', '').strip(),
            'quantity': data.get('quantity', '').strip(),
            'message': data.get('message', '').strip(),
            'type': 'quote_request'
        }
        
        # Save quote request
        saved_quote = save_contact(quote_data)
        
        logger.info(f"New quote request: {saved_quote['name']} - {saved_quote['transformer_type']}")
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your quote request! We will send you pricing details soon.',
            'quote_id': saved_quote['id']
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing quote request: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while processing your request. Please try again later.'
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'service': 'Vijay Industries API',
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/api/migrate', methods=['POST'])
def migrate_data():
    """
    Migrate existing JSON contacts to database (one-time operation)
    In production, add authentication/authorization
    """
    try:
        # In production, add authentication here
        # if not is_authenticated():
        #     return jsonify({'error': 'Unauthorized'}), 401
        
        migrate_json_to_db()
        
        return jsonify({
            'success': True,
            'message': 'Migration completed successfully'
        }), 200
    except Exception as e:
        logger.error(f"Error during migration: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Migration failed: {str(e)}'
        }), 500


@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    """
    Get all contact submissions (for admin use)
    In production, add authentication/authorization
    """
    try:
        # In production, add authentication here
        # if not is_authenticated():
        #     return jsonify({'error': 'Unauthorized'}), 401
        
        contacts = load_contacts()
        return jsonify({
            'success': True,
            'count': len(contacts),
            'contacts': contacts
        }), 200
    except Exception as e:
        logger.error(f"Error loading contacts: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to load contacts'
        }), 500


# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    try:
        index_path = os.path.join(CODE_DIR, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(CODE_DIR, 'index.html'), 404
        else:
            return "Page not found", 404
    except Exception as e:
        logger.error(f"Error in 404 handler: {str(e)}")
        return "Page not found", 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


if __name__ == '__main__':
    # Development server
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )

