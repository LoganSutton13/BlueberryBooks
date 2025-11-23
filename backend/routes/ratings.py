"""Rating routes"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.database import get_db
from models.models import Rating, Book, User
from routes.auth import get_current_user

router = APIRouter(prefix="/ratings", tags=["ratings"])


class RatingCreate(BaseModel):
    book_id: int
    rating: int  # 1-5


class RatingResponse(BaseModel):
    id: int
    user_id: int
    book_id: int
    rating: int
    created_at: datetime
    updated_at: Optional[datetime]
    book: Optional[dict] = None

    class Config:
        from_attributes = True


@router.post("", response_model=RatingResponse)
async def create_or_update_rating(
    rating_data: RatingCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Create or update a rating for a book"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    # Validate rating
    if rating_data.rating < 1 or rating_data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Check if book exists
    book = db.query(Book).filter(Book.id == rating_data.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if rating already exists
    existing_rating = db.query(Rating).filter(
        Rating.user_id == current_user.id,
        Rating.book_id == rating_data.book_id
    ).first()
    
    if existing_rating:
        # Update existing rating
        existing_rating.rating = rating_data.rating
        db.commit()
        db.refresh(existing_rating)
        
        # Return as dict with book info
        rating_dict = {
            "id": existing_rating.id,
            "user_id": existing_rating.user_id,
            "book_id": existing_rating.book_id,
            "rating": existing_rating.rating,
            "created_at": existing_rating.created_at,
            "updated_at": existing_rating.updated_at,
            "book": {
                "id": book.id,
                "open_library_id": book.open_library_id,
                "title": book.title,
                "author": book.author,
                "cover_image_url": book.cover_image_url
            } if book else None
        }
        return rating_dict
    
    # Create new rating
    new_rating = Rating(
        user_id=current_user.id,
        book_id=rating_data.book_id,
        rating=rating_data.rating
    )
    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)
    
    # Return as dict with book info
    rating_dict = {
        "id": new_rating.id,
        "user_id": new_rating.user_id,
        "book_id": new_rating.book_id,
        "rating": new_rating.rating,
        "created_at": new_rating.created_at,
        "updated_at": new_rating.updated_at,
        "book": {
            "id": book.id,
            "open_library_id": book.open_library_id,
            "title": book.title,
            "author": book.author,
            "cover_image_url": book.cover_image_url
        } if book else None
    }
    return rating_dict


@router.get("", response_model=List[RatingResponse])
async def get_all_ratings(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get all ratings for the current user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    ratings = db.query(Rating).filter(
        Rating.user_id == current_user.id
    ).order_by(desc(Rating.rating), desc(Rating.created_at)).all()
    
    # Add book information to each rating
    result = []
    for rating in ratings:
        book = db.query(Book).filter(Book.id == rating.book_id).first()
        rating_dict = {
            "id": rating.id,
            "user_id": rating.user_id,
            "book_id": rating.book_id,
            "rating": rating.rating,
            "created_at": rating.created_at,
            "updated_at": rating.updated_at,
            "book": {
                "id": book.id,
                "open_library_id": book.open_library_id,
                "open_library_id": book.open_library_id,
                "title": book.title,
                "author": book.author,
                "cover_image_url": book.cover_image_url
            } if book else None
        }
        result.append(rating_dict)
    
    return result


@router.get("/top10", response_model=List[RatingResponse])
async def get_top_10_rated_books(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get top 10 highest rated books for the current user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    ratings = db.query(Rating).filter(
        Rating.user_id == current_user.id
    ).order_by(desc(Rating.rating), desc(Rating.created_at)).limit(10).all()
    
    # Add book information to each rating
    result = []
    for rating in ratings:
        book = db.query(Book).filter(Book.id == rating.book_id).first()
        rating_dict = {
            "id": rating.id,
            "user_id": rating.user_id,
            "book_id": rating.book_id,
            "rating": rating.rating,
            "created_at": rating.created_at,
            "updated_at": rating.updated_at,
            "book": {
                "id": book.id,
                "open_library_id": book.open_library_id,
                "open_library_id": book.open_library_id,
                "title": book.title,
                "author": book.author,
                "cover_image_url": book.cover_image_url
            } if book else None
        }
        result.append(rating_dict)
    
    return result


@router.get("/{book_id}", response_model=RatingResponse)
async def get_rating_for_book(
    book_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get rating for a specific book"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    rating = db.query(Rating).filter(
        Rating.user_id == current_user.id,
        Rating.book_id == book_id
    ).first()
    
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    
    book = db.query(Book).filter(Book.id == book_id).first()
    rating_dict = {
        "id": rating.id,
        "user_id": rating.user_id,
        "book_id": rating.book_id,
        "rating": rating.rating,
        "created_at": rating.created_at,
        "updated_at": rating.updated_at,
        "book": {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "cover_image_url": book.cover_image_url
        } if book else None
    }
    
    return rating_dict


@router.delete("/{rating_id}")
async def delete_rating(
    rating_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Delete a rating"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    rating = db.query(Rating).filter(
        Rating.id == rating_id,
        Rating.user_id == current_user.id
    ).first()
    
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    
    db.delete(rating)
    db.commit()
    
    return {"message": "Rating deleted successfully"}

