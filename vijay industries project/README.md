# Vijay Industries Website - Flask Backend

A professional transformer reselling company website with Flask backend for contact form handling and API endpoints.

## Features

- **Static Website**: Beautiful, responsive HTML/CSS/JS frontend
- **Flask Backend**: Python backend for form submissions and API endpoints
- **Contact Form**: Professional contact form with validation
- **API Endpoints**: RESTful API for contact submissions and quote requests
- **Mobile Responsive**: Fully optimized for all devices

## Project Structure

```
.
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── Procfile              # Deployment configuration
├── runtime.txt           # Python version
├── .gitignore           # Git ignore file
├── code/                 # Frontend files
│   ├── index.html       # Main HTML file
│   ├── style.css        # Stylesheet
│   ├── script.js        # JavaScript
│   └── images/          # Image assets
└── data/                # Data storage (auto-created)
    └── contacts.json    # Contact submissions
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Application

**Development Mode:**
```bash
python app.py
```

The application will run on `http://localhost:5000`

**Production Mode:**
```bash
gunicorn app:app
```

### 3. Environment Variables (Optional)

Create a `.env` file for production:

```env
SECRET_KEY=your-secret-key-here
FLASK_ENV=production
PORT=5000
```

## API Endpoints

### POST `/api/contact`
Submit a contact form.

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 1234567890",
    "subject": "General Inquiry",
    "service_type": "Distribution Transformers",
    "message": "I need information about transformers"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Thank you for contacting us! We will get back to you soon.",
    "contact_id": 1
}
```

### POST `/api/quote`
Submit a quote request.

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 1234567890",
    "transformer_type": "Distribution Transformer",
    "specifications": "100 kVA, 11kV/415V",
    "quantity": "5",
    "message": "Additional requirements"
}
```

### GET `/api/health`
Health check endpoint.

### GET `/api/contacts`
Get all contact submissions (for admin use - add authentication in production).

## Deployment

### Render.com

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `gunicorn app:app`
6. Deploy!

### Railway

1. Push your code to GitHub
2. Create a new project on Railway
3. Connect your GitHub repository
4. Railway will auto-detect Flask and deploy

### Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`

### PythonAnywhere

1. Upload your files via the web interface
2. Create a new web app
3. Point it to your `app.py` file
4. Reload the web app

## Development

### Running in Development Mode

```bash
export FLASK_ENV=development
python app.py
```

### Testing the API

You can test the API endpoints using curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Submit contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

## Production Considerations

1. **Database**: Replace JSON file storage with a proper database (PostgreSQL, MySQL, etc.)
2. **Email**: Add email functionality using Flask-Mail or SendGrid
3. **Authentication**: Add authentication for admin endpoints
4. **Security**: 
   - Set a strong `SECRET_KEY`
   - Enable HTTPS
   - Add rate limiting
   - Validate and sanitize all inputs
5. **Error Handling**: Set up proper logging and error tracking
6. **CORS**: Configure CORS properly for production

## Technologies Used

- **Flask**: Python web framework
- **Gunicorn**: Production WSGI server
- **HTML/CSS/JavaScript**: Frontend
- **Font Awesome**: Icons
- **Google Fonts**: Typography

## License

© 2024 Vijay Industries. All rights reserved.

