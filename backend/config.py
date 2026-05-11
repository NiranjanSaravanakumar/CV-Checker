import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'change-this-secret-key-in-production')

    # Gemini AI
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///resumes.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # File Upload
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB limit
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

    # CORS – comma-separated origins in env var
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')
