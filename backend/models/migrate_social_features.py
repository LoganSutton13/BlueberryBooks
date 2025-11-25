"""Migration script to add social features to the database"""
import os
from pathlib import Path
from sqlalchemy import text

# Try to load dotenv, but don't fail if it's not available
try:
    from dotenv import load_dotenv
    HAS_DOTENV = True
except ImportError:
    HAS_DOTENV = False
    print("WARNING: python-dotenv not installed. Using system environment variables only.")

# Load environment variables
env_loaded = False
if HAS_DOTENV:
    possible_paths = [
        Path(__file__).parent.parent / ".env.local",
        Path(__file__).parent.parent.parent / ".env.local",
        Path(__file__).parent.parent / ".env",
    ]

    for env_path in possible_paths:
        if env_path.exists():
            load_dotenv(env_path)
            print(f"Loaded environment variables from {env_path}")
            env_loaded = True
            break

if not env_loaded and HAS_DOTENV:
    print("WARNING: No .env.local or .env file found. Using system environment variables.")
elif not HAS_DOTENV:
    print("Using system environment variables (python-dotenv not available)")

from .database import engine, Base
from .models import User, Book, DiaryEntry, Rating, ReadBook, Follow


def migrate_social_features():
    """Add social features: Follow table and is_private column to users"""
    # Use the same logic as database.py to determine which database to use
    from .database import DATABASE_URL
    
    if DATABASE_URL.startswith("sqlite"):
        print("Using SQLite database")
        migrate_sqlite()
    else:
        print(f"Using PostgreSQL database")
        migrate_postgresql()


def migrate_sqlite():
    """Migrate SQLite database"""
    with engine.begin() as conn:
        # Check if is_private column exists
        result = conn.execute(text("PRAGMA table_info(users)"))
        columns = [row[1] for row in result]
        
        if 'is_private' not in columns:
            print("Adding is_private column to users table...")
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN is_private INTEGER DEFAULT 0 NOT NULL"))
                print("SUCCESS: Added is_private column to users table")
            except Exception as e:
                print(f"ERROR: Error adding is_private column: {e}")
                raise
        else:
            print("SUCCESS: is_private column already exists")
    
    # Create Follow table if it doesn't exist
    try:
        Base.metadata.create_all(bind=engine, tables=[Follow.__table__])
        print("SUCCESS: Follow table created/verified")
    except Exception as e:
        print(f"NOTE: Follow table issue: {e}")


def migrate_postgresql():
    """Migrate PostgreSQL database"""
    with engine.begin() as conn:
        # Check if is_private column exists
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='is_private'
        """))
        
        if result.fetchone() is None:
            print("Adding is_private column to users table...")
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN is_private INTEGER DEFAULT 0 NOT NULL"))
                print("SUCCESS: Added is_private column to users table")
            except Exception as e:
                print(f"ERROR: Error adding is_private column: {e}")
                raise
        else:
            print("SUCCESS: is_private column already exists")
    
    # Create Follow table if it doesn't exist
    try:
        Base.metadata.create_all(bind=engine, tables=[Follow.__table__])
        print("SUCCESS: Follow table created/verified")
    except Exception as e:
        print(f"NOTE: Follow table issue: {e}")


if __name__ == "__main__":
    print("Starting social features migration...")
    print("=" * 50)
    migrate_social_features()
    print("=" * 50)
    print("Migration complete!")

