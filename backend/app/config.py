import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    JWT_SECRET = os.environ.get("JWT_SECRET")
    DB_PATH = os.environ.get("DB_PATH", "./database.sqlite")
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "./uploads")
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024
