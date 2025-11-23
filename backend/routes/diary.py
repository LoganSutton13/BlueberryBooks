"""Diary entry routes"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.database import get_db
from models.models import DiaryEntry, Book, User
from routes.auth import get_current_user

router = APIRouter(prefix="/diary", tags=["diary"])


class DiaryEntryCreate(BaseModel):
    book_id: int
    entry_text: str


class DiaryEntryUpdate(BaseModel):
    entry_text: str


class DiaryEntryResponse(BaseModel):
    id: int
    user_id: int
    book_id: int
    entry_text: str
    created_at: datetime
    updated_at: Optional[datetime]
    book: Optional[dict] = None

    class Config:
        from_attributes = True


@router.post("", response_model=DiaryEntryResponse)
async def create_diary_entry(
    entry_data: DiaryEntryCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Create a new diary entry for a book"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    # Check if book exists
    book = db.query(Book).filter(Book.id == entry_data.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if entry already exists
    existing_entry = db.query(DiaryEntry).filter(
        DiaryEntry.user_id == current_user.id,
        DiaryEntry.book_id == entry_data.book_id
    ).first()
    
    if existing_entry:
        raise HTTPException(
            status_code=400,
            detail="Diary entry already exists for this book. Use update endpoint to modify it."
        )
    
    # Create new entry
    new_entry = DiaryEntry(
        user_id=current_user.id,
        book_id=entry_data.book_id,
        entry_text=entry_data.entry_text
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    return new_entry


@router.get("", response_model=List[DiaryEntryResponse])
async def get_all_diary_entries(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get all diary entries for the current user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    entries = db.query(DiaryEntry).filter(
        DiaryEntry.user_id == current_user.id
    ).order_by(DiaryEntry.created_at.desc()).all()
    
    # Add book information to each entry
    result = []
    for entry in entries:
        book = db.query(Book).filter(Book.id == entry.book_id).first()
        entry_dict = {
            "id": entry.id,
            "user_id": entry.user_id,
            "book_id": entry.book_id,
            "entry_text": entry.entry_text,
            "created_at": entry.created_at,
            "updated_at": entry.updated_at,
            "book": {
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "cover_image_url": book.cover_image_url
            } if book else None
        }
        result.append(entry_dict)
    
    return result


@router.get("/{book_id}", response_model=DiaryEntryResponse)
async def get_diary_entry_for_book(
    book_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get diary entry for a specific book"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    entry = db.query(DiaryEntry).filter(
        DiaryEntry.user_id == current_user.id,
        DiaryEntry.book_id == book_id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Diary entry not found")
    
    book = db.query(Book).filter(Book.id == book_id).first()
    entry_dict = {
        "id": entry.id,
        "user_id": entry.user_id,
        "book_id": entry.book_id,
        "entry_text": entry.entry_text,
        "created_at": entry.created_at,
        "updated_at": entry.updated_at,
        "book": {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "cover_image_url": book.cover_image_url
        } if book else None
    }
    
    return entry_dict


@router.put("/{entry_id}", response_model=DiaryEntryResponse)
async def update_diary_entry(
    entry_id: int,
    entry_data: DiaryEntryUpdate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Update a diary entry"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    entry = db.query(DiaryEntry).filter(
        DiaryEntry.id == entry_id,
        DiaryEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Diary entry not found")
    
    entry.entry_text = entry_data.entry_text
    db.commit()
    db.refresh(entry)
    
    return entry


@router.delete("/{entry_id}")
async def delete_diary_entry(
    entry_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Delete a diary entry"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    current_user = get_current_user(token, db)
    
    entry = db.query(DiaryEntry).filter(
        DiaryEntry.id == entry_id,
        DiaryEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Diary entry not found")
    
    db.delete(entry)
    db.commit()
    
    return {"message": "Diary entry deleted successfully"}

