"""
Vercel Serverless Function Wrapper for Flask App
Vercel's @vercel/python automatically handles Flask WSGI applications
"""

import sys
import os

# Add parent directory to path so we can import app
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Import the Flask app
from app import app

# Vercel's @vercel/python builder automatically handles Flask apps
# Just export the app and it will work
__all__ = ['app']

