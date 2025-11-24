"""Database connection and session management"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Get database URL from environment variable
# Default to SQLite for local development if DATABASE_URL is not set or is the placeholder
default_db_url = os.getenv("DATABASE_URL", "")
if not default_db_url or default_db_url == "postgresql://user:password@localhost/dbname":
    # Use SQLite for local development
    default_db_url = "sqlite:///./blueberrybooks.db"

DATABASE_URL = default_db_url

# Create engine
# For SQLite, we need check_same_thread=False
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

