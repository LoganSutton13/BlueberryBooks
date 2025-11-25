"""Database connection and session management"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Determine which database to use based on environment
# Production (Vercel): Use DATABASE_URL from environment (PostgreSQL)
# Development (Local): Use DEV_DATABASE_URL if set, otherwise default to SQLite
is_production = os.getenv("VERCEL") is not None

if is_production:
    # In production (Vercel), always use DATABASE_URL (PostgreSQL)
    database_url = os.getenv("DATABASE_URL", "")
    if not database_url:
        raise ValueError("DATABASE_URL must be set in production (Vercel)")
    DATABASE_URL = database_url
else:
    # In local development, use DEV_DATABASE_URL if set, otherwise default to SQLite
    dev_database_url = os.getenv("DEV_DATABASE_URL", "")
    if dev_database_url:
        DATABASE_URL = dev_database_url
    else:
        # Default to SQLite for local development
        DATABASE_URL = "sqlite:///./blueberrybooks.db"

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

