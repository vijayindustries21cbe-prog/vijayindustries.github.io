"""
Simple test script for Flask API endpoints
Run this after starting the Flask server to test the API
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check endpoint...")
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_contact_form():
    """Test the contact form submission"""
    print("Testing contact form submission...")
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "+91 1234567890",
        "subject": "General Inquiry",
        "service_type": "Distribution Transformers",
        "message": "This is a test message from the API test script."
    }
    response = requests.post(
        f"{BASE_URL}/api/contact",
        json=data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_quote_request():
    """Test the quote request submission"""
    print("Testing quote request submission...")
    data = {
        "name": "Test Company",
        "email": "company@example.com",
        "phone": "+91 9876543210",
        "transformer_type": "Distribution Transformer",
        "specifications": "100 kVA, 11kV/415V",
        "quantity": "5",
        "message": "Need pricing for bulk order"
    }
    response = requests.post(
        f"{BASE_URL}/api/quote",
        json=data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

if __name__ == "__main__":
    print("=" * 50)
    print("Flask API Test Script")
    print("=" * 50)
    print()
    
    try:
        test_health_check()
        test_contact_form()
        test_quote_request()
        
        print("=" * 50)
        print("All tests completed!")
        print("=" * 50)
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to Flask server.")
        print("Make sure the Flask server is running on http://localhost:5000")
        print("Start it with: python app.py")
    except Exception as e:
        print(f"Error: {str(e)}")

