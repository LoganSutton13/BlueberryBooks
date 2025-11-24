"""Book-related routes"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.database import get_db
from models.models import Book, ReadBook, User
from utils.open_library import search_books, get_book_details
from routes.auth import get_current_user

router = APIRouter(prefix="/books", tags=["books"])


class BookResponse(BaseModel):
    id: int
    open_library_id: str
    title: str
    author: Optional[str]
    isbn: Optional[str]
    cover_image_url: Optional[str]
    description: Optional[str]
    published_year: Optional[int]

    class Config:
        from_attributes = True


class BookSearchResult(BaseModel):
    open_library_id: str
    title: str
    author: str
    isbn: Optional[str]
    cover_image_url: Optional[str]
    published_year: Optional[int]


@router.get("/search")
async def search_books_endpoint(
    q: str,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Search for books using Open Library API"""
    if not q or len(q.strip()) == 0:
        raise HTTPException(status_code=400, detail="Search query is required")
    
    results = search_books(q, limit)
    return {"results": results}


@router.get("/{book_id}", response_model=BookResponse)
async def get_book(book_id: int, db: Session = Depends(get_db)):
    """Get book details by ID"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.post("/add")
async def add_book_to_library(
    open_library_id: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Add a book to the database from Open Library"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    # Check if book already exists
    existing_book = db.query(Book).filter(Book.open_library_id == open_library_id).first()
    if existing_book:
        return {"book_id": existing_book.id, "message": "Book already exists"}
    
    # Fetch book details from Open Library
    book_data = get_book_details(open_library_id)
    if not book_data:
        raise HTTPException(status_code=404, detail="Book not found in Open Library")
    
    # Create book record
    new_book = Book(
        open_library_id=book_data["open_library_id"],
        title=book_data["title"],
        author=book_data.get("author"),
        isbn=book_data.get("isbn"),
        cover_image_url=book_data.get("cover_image_url"),
        description=book_data.get("description"),
        published_year=int(book_data["published_year"]) if book_data.get("published_year") else None
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    
    return {"book_id": new_book.id, "message": "Book added successfully"}


@router.post("/{book_id}/read")
async def mark_book_as_read(
    book_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Mark a book as read"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    # Check if book exists
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if already marked as read
    existing = db.query(ReadBook).filter(
        ReadBook.user_id == current_user.id,
        ReadBook.book_id == book_id
    ).first()
    
    if existing:
        return {"message": "Book already marked as read"}
    
    # Mark as read
    read_book = ReadBook(
        user_id=current_user.id,
        book_id=book_id
    )
    db.add(read_book)
    db.commit()
    
    return {"message": "Book marked as read"}


@router.get("/user/read", response_model=List[BookResponse])
async def get_user_read_books(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get all books read by the current user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    read_books = db.query(Book).join(ReadBook).filter(
        ReadBook.user_id == current_user.id
    ).all()
    
    return read_books

