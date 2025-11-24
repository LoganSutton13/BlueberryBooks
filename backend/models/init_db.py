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
        print(f"✅ Loaded environment variables from {env_path}")
        env_loaded = True
        break

if not env_loaded:
    print("⚠️  Warning: No .env.local or .env file found. Using system environment variables.")
    print("   Tried locations:")
    for path in possible_paths:
        print(f"   - {path} {'(exists)' if path.exists() else '(not found)'}")

from .database import engine, Base
from .models import User, Book, DiaryEntry, Rating, ReadBook


def init_db():
    """Initialize database tables"""
    # Verify DATABASE_URL is set
    database_url = os.getenv("DATABASE_URL", "")
    if not database_url:
        print("❌ ERROR: DATABASE_URL environment variable is not set!")
        print("\nTroubleshooting steps:")
        print("1. Make sure you're in the backend directory")
        print("2. Run: vercel link (if not already linked)")
        print("3. Run: vercel env pull .env.local")
        print("4. Verify .env.local exists in backend/ directory")
        print("5. Check that .env.local contains: DATABASE_URL=postgresql://...")
        print("\nCurrent working directory:", os.getcwd())
        return
    
    if database_url.startswith("sqlite"):
        print("WARNING: Using SQLite database. Make sure DATABASE_URL points to your Vercel PostgreSQL database.")
    else:
        print(f"Connecting to database: {database_url.split('@')[1] if '@' in database_url else 'database'}")
    
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        raise


if __name__ == "__main__":
    init_db()

