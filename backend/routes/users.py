"""User-related routes for social features"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.database import get_db
from models.models import User, Follow, Rating, DiaryEntry, Book
from routes.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


class UserSearchResult(BaseModel):
    id: int
    username: str
    is_private: bool

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    id: int
    username: str
    is_private: bool
    followers_count: int
    following_count: int
    is_following: bool
    is_friend: bool
    can_view: bool


class TopRatedBook(BaseModel):
    book_id: int
    open_library_id: Optional[str]
    title: str
    author: Optional[str]
    cover_image_url: Optional[str]
    rating: int
    review: Optional[str]


class UserProfileWithBooksResponse(UserProfileResponse):
    top_rated_books: List[TopRatedBook] = []


class PrivacyUpdate(BaseModel):
    is_private: bool


@router.get("/search")
async def search_users(
    q: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Search for users by username"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    if not q or len(q.strip()) == 0:
        raise HTTPException(status_code=400, detail="Search query is required")
    
    # Search for users matching the query (excluding current user)
    users = db.query(User).filter(
        User.username.ilike(f"%{q}%"),
        User.id != current_user.id
    ).limit(20).all()
    
    return {
        "results": [
            {
                "id": user.id,
                "username": user.username,
                "is_private": bool(user.is_private)
            }
            for user in users
        ]
    }


@router.get("/me/profile", response_model=UserProfileResponse)
async def get_own_profile(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get current user's own profile"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    # Get follower and following counts
    followers_count = db.query(Follow).filter(Follow.followed_id == current_user.id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == current_user.id).count()
    
    return {
        "id": current_user.id,
        "username": current_user.username,
        "is_private": bool(current_user.is_private),
        "followers_count": followers_count,
        "following_count": following_count,
        "is_following": False,
        "is_friend": False,
        "can_view": True
    }


@router.put("/me/privacy")
async def update_privacy_setting(
    privacy_data: PrivacyUpdate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Update user's privacy setting"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    current_user.is_private = 1 if privacy_data.is_private else 0
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Privacy setting updated",
        "is_private": bool(current_user.is_private)
    }


@router.get("/{user_id}/profile", response_model=UserProfileWithBooksResponse)
async def get_user_profile(
    user_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get a user's profile with their top 10 rated books and reviews"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    # Get the target user
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if current user is following target user
    is_following = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == user_id
    ).first() is not None
    
    # Check if target user is following current user (friendship)
    is_friend = is_following and db.query(Follow).filter(
        Follow.follower_id == user_id,
        Follow.followed_id == current_user.id
    ).first() is not None
    
    # Check if current user can view the profile
    # Can view if: profile is public, or current user is following, or viewing own profile
    can_view = (
        not bool(target_user.is_private) or 
        is_following or 
        current_user.id == user_id
    )
    
    # Get follower and following counts
    followers_count = db.query(Follow).filter(Follow.followed_id == user_id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user_id).count()
    
    # Get top 10 rated books with reviews if can_view
    top_rated_books = []
    if can_view:
        # Get top 10 ratings
        ratings = db.query(Rating).filter(
            Rating.user_id == user_id
        ).order_by(desc(Rating.rating), desc(Rating.created_at)).limit(10).all()
        
        for rating in ratings:
            book = db.query(Book).filter(Book.id == rating.book_id).first()
            if not book:
                continue
            
            # Get diary entry (review) for this book
            diary_entry = db.query(DiaryEntry).filter(
                DiaryEntry.user_id == user_id,
                DiaryEntry.book_id == rating.book_id
            ).first()
            
            top_rated_books.append({
                "book_id": book.id,
                "open_library_id": book.open_library_id,
                "title": book.title,
                "author": book.author,
                "cover_image_url": book.cover_image_url,
                "rating": rating.rating,
                "review": diary_entry.entry_text if diary_entry else None
            })
    
    return {
        "id": target_user.id,
        "username": target_user.username,
        "is_private": bool(target_user.is_private),
        "followers_count": followers_count,
        "following_count": following_count,
        "is_following": is_following,
        "is_friend": is_friend,
        "can_view": can_view,
        "top_rated_books": top_rated_books
    }


@router.post("/{user_id}/follow")
async def follow_user(
    user_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Follow a user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    # Can't follow yourself
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    
    # Check if user exists
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already following
    existing_follow = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == user_id
    ).first()
    
    if existing_follow:
        return {"message": "Already following this user"}
    
    # Create follow relationship
    new_follow = Follow(
        follower_id=current_user.id,
        followed_id=user_id
    )
    db.add(new_follow)
    db.commit()
    
    return {"message": "Successfully followed user"}


@router.delete("/{user_id}/follow")
async def unfollow_user(
    user_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Unfollow a user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    # Find and delete follow relationship
    follow = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == user_id
    ).first()
    
    if not follow:
        raise HTTPException(status_code=404, detail="Not following this user")
    
    db.delete(follow)
    db.commit()
    
    return {"message": "Successfully unfollowed user"}

