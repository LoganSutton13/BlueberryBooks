"""Database initialization script"""
from .database import engine, Base
from .models import User, Book, DiaryEntry, Rating, ReadBook


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    init_db()

