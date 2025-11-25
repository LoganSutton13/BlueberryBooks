"""Database models for BlueberryBooks"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    """User model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_private = Column(Integer, default=0, nullable=False)  # 0 = public, 1 = private
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    diary_entries = relationship("DiaryEntry", back_populates="user", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="user", cascade="all, delete-orphan")
    read_books = relationship("ReadBook", back_populates="user", cascade="all, delete-orphan")
    following = relationship("Follow", foreign_keys="Follow.follower_id", back_populates="follower", cascade="all, delete-orphan")
    followers = relationship("Follow", foreign_keys="Follow.followed_id", back_populates="followed", cascade="all, delete-orphan")


class Book(Base):
    """Book model - stores book information from Open Library API"""
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    open_library_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    author = Column(String)
    isbn = Column(String)
    cover_image_url = Column(String)
    description = Column(Text)
    published_year = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    diary_entries = relationship("DiaryEntry", back_populates="book", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="book", cascade="all, delete-orphan")
    read_books = relationship("ReadBook", back_populates="book", cascade="all, delete-orphan")


class DiaryEntry(Base):
    """Diary entry model for user's personal book reviews"""
    __tablename__ = "diary_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    entry_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="diary_entries")
    book = relationship("Book", back_populates="diary_entries")


class Rating(Base):
    """Rating model for book ratings (1-5 stars)"""
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="ratings")
    book = relationship("Book", back_populates="ratings")

    # Unique constraint: one rating per user per book
    __table_args__ = (
        UniqueConstraint('user_id', 'book_id', name='unique_user_book_rating'),
    )


class ReadBook(Base):
    """ReadBook model - tracks which books a user has read"""
    __tablename__ = "read_books"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    read_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="read_books")
    book = relationship("Book", back_populates="read_books")

    # Unique constraint: one record per user per book
    __table_args__ = (
        UniqueConstraint('user_id', 'book_id', name='unique_user_book_read'),
    )


class Follow(Base):
    """Follow model - tracks user following relationships"""
    __tablename__ = "follows"

    id = Column(Integer, primary_key=True, index=True)
    follower_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    followed_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    follower = relationship("User", foreign_keys=[follower_id], back_populates="following")
    followed = relationship("User", foreign_keys=[followed_id], back_populates="followers")

    # Unique constraint: one follow relationship per user pair
    __table_args__ = (
        UniqueConstraint('follower_id', 'followed_id', name='unique_follow_relationship'),
    )

