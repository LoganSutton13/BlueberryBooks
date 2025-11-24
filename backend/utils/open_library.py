"""Open Library API integration"""
import requests
from typing import Optional, Dict, List

OPEN_LIBRARY_API_BASE = "https://openlibrary.org"


def search_books(query: str, limit: int = 20) -> List[Dict]:
    """
    Search for books using Open Library API
    
    Args:
        query: Search query string
        limit: Maximum number of results to return
    
    Returns:
        List of book dictionaries with relevant information
    """
    try:
        url = f"{OPEN_LIBRARY_API_BASE}/search.json"
        params = {
            "q": query,
            "limit": limit
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        books = []
        for doc in data.get("docs", []):
            book = {
                "open_library_id": doc.get("key", "").replace("/works/", ""),
                "title": doc.get("title", "Unknown Title"),
                "author": ", ".join(doc.get("author_name", ["Unknown Author"])),
                "isbn": doc.get("isbn", [None])[0] if doc.get("isbn") else None,
                "published_year": doc.get("first_publish_year"),
                "cover_image_url": None
            }
            
            # Get cover image if available
            if doc.get("cover_i"):
                book["cover_image_url"] = f"https://covers.openlibrary.org/b/id/{doc['cover_i']}-L.jpg"
            elif doc.get("isbn"):
                isbn = doc.get("isbn", [None])[0]
                if isbn:
                    book["cover_image_url"] = f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"
            
            books.append(book)
        
        return books
    except Exception as e:
        print(f"Error searching books: {e}")
        return []


def get_book_details(open_library_id: str) -> Optional[Dict]:
    """
    Get detailed information about a specific book
    
    Args:
        open_library_id: Open Library work ID
    
    Returns:
        Dictionary with book details or None if not found
    """
    try:
        url = f"{OPEN_LIBRARY_API_BASE}/works/{open_library_id}.json"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        book = {
            "open_library_id": open_library_id,
            "title": data.get("title", "Unknown Title"),
            "author": ", ".join([author.get("name", "") for author in data.get("authors", [])]),
            "description": data.get("description", {}).get("value") if isinstance(data.get("description"), dict) else data.get("description", ""),
            "published_year": data.get("first_publish_date", "").split("-")[0] if data.get("first_publish_date") else None,
            "isbn": None,
            "cover_image_url": None
        }
        
        # Try to get ISBN from identifiers
        if data.get("identifiers", {}).get("isbn_13"):
            book["isbn"] = data.get("identifiers", {}).get("isbn_13", [None])[0]
        elif data.get("identifiers", {}).get("isbn_10"):
            book["isbn"] = data.get("identifiers", {}).get("isbn_10", [None])[0]
        
        # Get cover image
        if book["isbn"]:
            book["cover_image_url"] = f"https://covers.openlibrary.org/b/isbn/{book['isbn']}-L.jpg"
        
        return book
    except Exception as e:
        print(f"Error getting book details: {e}")
        return None

