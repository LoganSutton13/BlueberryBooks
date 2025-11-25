"""Database initialization script"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env.local if it exists
# Try multiple locations:
# 1. backend/.env.local (where vercel env pull creates it when run from backend/)
# 2. project root/.env.local (where vercel env pull creates it when run from root)
# 3. backend/.env (local development)

env_loaded = False
possible_paths = [
    Path(__file__).parent.parent / ".env.local",  # backend/.env.local
    Path(__file__).parent.parent.parent / ".env.local",  # root/.env.local
    Path(__file__).parent.parent / ".env",  # backend/.env
]

for env_path in possible_paths:
    if env_path.exists():
        load_dotenv(env_path)
        print(f"Loaded environment variables from {env_path}")
        env_loaded = True
        break

if not env_loaded:
    print("⚠️  Warning: No .env.local or .env file found. Using system environment variables.")
    print("   Tried locations:")
    for path in possible_paths:
        print(f"   - {path} {'(exists)' if path.exists() else '(not found)'}")

from .database import engine, Base
from .models import User, Book, DiaryEntry, Rating, ReadBook, Follow


def init_db():
    """Initialize database tables"""
    # Use the same logic as database.py to determine which database to use
    from .database import DATABASE_URL, engine
    
    if DATABASE_URL.startswith("sqlite"):
        print("Using SQLite database for local development")
        print(f"Database file: blueberrybooks.db")
    else:
        # Mask password in connection string for display
        display_url = DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'database'
        print(f"Connecting to PostgreSQL database: {display_url}")
    
    try:
        Base.metadata.create_all(bind=engine)
        print("SUCCESS: Database tables created successfully!")
    except Exception as e:
        print(f"ERROR: Error creating database tables: {e}")
        raise


if __name__ == "__main__":
    init_db()

