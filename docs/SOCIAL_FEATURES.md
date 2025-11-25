# Social Features Documentation

This document describes the social media features added to BlueberryBooks, including user profiles, following system, and privacy controls.

## Overview

The social features allow users to:
- Search for other users by username
- View other users' profiles with their top 10 rated books and reviews
- Follow/unfollow other users
- Set their profile to private (only followers can view)
- See follower and following counts
- Identify mutual follows (friends)

## Database Schema

### Users Table Updates

Added new column:
- `is_private`: INTEGER (0 = public, 1 = private)
  - Default: 0 (public)
  - Users can toggle this in their profile settings

### Follows Table

New table to track user relationships:
- `id`: Primary key
- `follower_id`: Foreign key to Users (user who is following)
- `followed_id`: Foreign key to Users (user being followed)
- `created_at`: Timestamp when follow relationship was created
- **Unique Constraint**: One follow relationship per user pair (prevents duplicate follows)

## API Endpoints

### User Search

**GET** `/api/users/search?q={query}`

Search for users by username.

**Headers:**
- `Authorization: Bearer {token}` (required)

**Query Parameters:**
- `q`: Search query (username to search for)

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "username": "johndoe",
      "is_private": false
    }
  ]
}
```

**Notes:**
- Excludes the current user from results
- Returns up to 20 matching users
- Case-insensitive search

### Get Own Profile

**GET** `/api/users/me/profile`

Get the current user's own profile information.

**Headers:**
- `Authorization: Bearer {token}` (required)

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "is_private": false,
  "followers_count": 5,
  "following_count": 3,
  "is_following": false,
  "is_friend": false,
  "can_view": true
}
```

### Get User Profile

**GET** `/api/users/{user_id}/profile`

Get another user's profile with their top 10 rated books and reviews.

**Headers:**
- `Authorization: Bearer {token}` (required)

**Path Parameters:**
- `user_id`: ID of the user whose profile to view

**Response:**
```json
{
  "id": 2,
  "username": "janedoe",
  "is_private": false,
  "followers_count": 10,
  "following_count": 8,
  "is_following": true,
  "is_friend": true,
  "can_view": true,
  "top_rated_books": [
    {
      "book_id": 1,
      "open_library_id": "OL123456W",
      "title": "Example Book",
      "author": "Author Name",
      "cover_image_url": "https://...",
      "rating": 5,
      "review": "Great book!"
    }
  ]
}
```

**Privacy Rules:**
- If profile is public: Anyone can view
- If profile is private: Only followers can view
- Users can always view their own profile
- If `can_view` is false, `top_rated_books` will be empty

**Friends:**
- `is_friend` is `true` when both users follow each other (mutual follow)

### Follow User

**POST** `/api/users/{user_id}/follow`

Follow another user.

**Headers:**
- `Authorization: Bearer {token}` (required)

**Path Parameters:**
- `user_id`: ID of the user to follow

**Response:**
```json
{
  "message": "Successfully followed user"
}
```

**Errors:**
- 400: Cannot follow yourself
- 404: User not found
- Returns success message if already following

### Unfollow User

**DELETE** `/api/users/{user_id}/follow`

Unfollow a user.

**Headers:**
- `Authorization: Bearer {token}` (required)

**Path Parameters:**
- `user_id`: ID of the user to unfollow

**Response:**
```json
{
  "message": "Successfully unfollowed user"
}
```

**Errors:**
- 404: Not following this user

### Update Privacy Setting

**PUT** `/api/users/me/privacy`

Update your profile privacy setting.

**Headers:**
- `Authorization: Bearer {token}` (required)

**Body:**
```json
{
  "is_private": true
}
```

**Response:**
```json
{
  "message": "Privacy setting updated",
  "is_private": true
}
```

## Frontend Pages

### User Search Page

**Route:** `/users/search`

Features:
- Search input for username
- List of matching users
- Click to view user profile
- Shows privacy indicator for private profiles

### User Profile Page

**Route:** `/users/[id]`

Features:
- User information (username, follower/following counts)
- Friend indicator (if mutual follow)
- Follow/unfollow button
- Top 10 rated books with:
  - Book cover image
  - Title and author
  - Star rating
  - Review text (if available)
- Privacy message if profile is private and user is not following

### Profile Settings Page

**Route:** `/profile`

Features:
- View own profile information
- Follower and following counts
- Privacy toggle switch
- Explanation of privacy settings

## Database Migration

To add social features to an existing database, run:

```bash
cd backend
python -m models.migrate_social_features
```

This migration will:
1. Add `is_private` column to `users` table (if it doesn't exist)
2. Create `follows` table (if it doesn't exist)
3. Set default `is_private` to 0 (public) for existing users

**Note:** The migration is idempotent - safe to run multiple times.

## Environment Configuration

### Local Development

The app automatically uses `DEV_DATABASE_URL` for local development:

```env
# backend/.env.local
DEV_DATABASE_URL=sqlite:///./blueberrybooks.db
SECRET_KEY=your-secret-key-here
```

If `DEV_DATABASE_URL` is not set, it defaults to SQLite.

### Production (Vercel)

In production, the app uses `DATABASE_URL`:

```env
# Set in Vercel Dashboard
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key-here
VERCEL=1  # Automatically set by Vercel
```

## Privacy Model

### Public Profiles (default)
- Anyone can view the profile
- Anyone can see top 10 rated books and reviews
- Anyone can follow the user

### Private Profiles
- Only followers can view the profile
- Only followers can see top 10 rated books and reviews
- Anyone can still follow the user (they just can't see the profile until they follow)
- Users can always view their own profile regardless of privacy setting

## Friend System

When two users follow each other, they are considered "friends":
- `is_friend` flag is set to `true` in profile responses
- Friend indicator badge shown on profile pages
- No special functionality beyond the indicator (future feature potential)

## Implementation Notes

### Route Ordering

The `/me/profile` route must be defined **before** `/{user_id}/profile` in the router to prevent FastAPI from trying to parse "me" as an integer user ID.

### Database Queries

- Follower/following counts use efficient SQL COUNT queries
- Top 10 books are ordered by rating (descending), then by creation date
- Diary entries (reviews) are joined with ratings for the profile view

### Performance Considerations

- User search uses case-insensitive LIKE queries (consider full-text search for large user bases)
- Follow relationships use unique constraints to prevent duplicates
- Profile queries are optimized to minimize database round trips

## Future Enhancements

Potential future features:
- Activity feed (see what friends are reading)
- Book recommendations from friends
- Reading challenges with friends
- Direct messaging
- Book clubs/groups
- Enhanced privacy options (block users, approve follow requests)

