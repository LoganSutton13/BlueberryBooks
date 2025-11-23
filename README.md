# BlueberryBooks

All-in-one book diary for reviews and ratings - A Progressive Web App (PWA) for tracking your reading journey.

## Overview

BlueberryBooks is a mobile-first book diary application that allows users to track their reading, write personal diary entries, rate books, and view their reading history. The app features a simple, warm design with a progression system to gamify the reading experience.

## Tech Stack

- **Frontend**: React Native Web with TypeScript (for PWA capabilities)
- **Backend**: FastAPI (Python) with Vercel Serverless Functions
- **Database**: Vercel Postgres (PostgreSQL)
- **Book API**: Open Library API
- **Authentication**: Password hashing with bcrypt
- **Hosting**: Vercel (frontend and backend)

## Features

### Authentication
- User registration with unique username and password
- User login functionality
- Secure session management with JWT tokens

### Book Management
- **Book Search**: Search and find any book using Open Library API
- **Book Collection**: Mark books as read (no rating or diary entry required)
- **View All Read Books**: See a complete list of all books the user has read

### Diary & Reviews
- **Personal Diary Entries**: Write personal diary reviews for any book
- **View Past Entries**: Access all previous diary entries
- **Optional Entries**: Users can mark books as read without writing a diary entry
- **Update/Delete**: Users can update or delete their diary entries

### Rating System
- **Star Rating**: Rate books on a 1-5 star scale
- **Top 10 Rated Books**: View the user's top 10 highest-rated books
- **Rating History**: See all past ratings given to books
- **Optional Ratings**: Users can mark books as read without rating them
- **Update Ratings**: Users can update their ratings for books

### Progression System
- **XP System**: Gain experience points as users read and log more books
- **Leveling System**: Level up reading skills based on activity
- *Note: Detailed implementation to be defined later*

## Design Theme

- **Background**: Clean white
- **Accent Colors**: Warm, inviting light brown tones (#8B6F47, #D4A574)
- **Text**: Black for all text content
- **Style**: Simple, minimal, and inviting

## Database Schema

### Users
- `id`: Unique user identifier
- `username`: Unique username
- `password_hash`: Hashed password (bcrypt)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Books
- `id`: Unique book identifier
- `open_library_id`: Open Library work ID
- `title`: Book title
- `author`: Book author(s)
- `isbn`: ISBN (if available)
- `cover_image_url`: Book cover image URL
- `description`: Book description
- `published_year`: Year published
- `created_at`: Record creation timestamp

### Diary Entries
- `id`: Unique entry identifier
- `user_id`: Foreign key to Users
- `book_id`: Foreign key to Books
- `entry_text`: Diary entry content
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Ratings
- `id`: Unique rating identifier
- `user_id`: Foreign key to Users
- `book_id`: Foreign key to Books
- `rating`: Integer (1-5)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- **Unique Constraint**: One rating per user per book

### Read Books (Collection)
- `id`: Unique record identifier
- `user_id`: Foreign key to Users
- `book_id`: Foreign key to Books
- `read_at`: Timestamp when marked as read
- **Unique Constraint**: One record per user per book

## Project Structure

```
BlueberryBooks/
├── frontend/              # React Native Web frontend
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   ├── theme/        # Theme configuration
│   │   └── components/   # React components
│   ├── public/           # Static assets, manifest, service worker
│   └── package.json
├── backend/              # Python backend API
│   ├── api/              # FastAPI application
│   ├── models/           # Database models
│   ├── routes/           # API route handlers
│   ├── utils/            # Utility functions
│   └── requirements.txt
├── vercel.json           # Vercel configuration
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: `{ "username": string, "password": string }`
  - Returns: `{ "access_token": string, "token_type": "bearer", "user_id": int, "username": string }`

- `POST /api/auth/login` - User login
  - Body: `{ "username": string, "password": string }`
  - Returns: `{ "access_token": string, "token_type": "bearer", "user_id": int, "username": string }`

### Books
- `GET /api/books/search?q={query}&limit={limit}` - Search for books
  - Returns: `{ "results": [...] }`

- `GET /api/books/{book_id}` - Get book details
  - Returns: Book object

- `POST /api/books/add?open_library_id={id}` - Add book to database
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ "book_id": int, "message": string }`

- `POST /api/books/{book_id}/read` - Mark book as read
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ "message": string }`

- `GET /api/books/user/read` - Get all read books
  - Headers: `Authorization: Bearer {token}`
  - Returns: Array of Book objects

### Diary Entries
- `GET /api/diary` - Get all user's diary entries
  - Headers: `Authorization: Bearer {token}`
  - Returns: Array of DiaryEntry objects with book info

- `GET /api/diary/{book_id}` - Get diary entry for specific book
  - Headers: `Authorization: Bearer {token}`
  - Returns: DiaryEntry object with book info

- `POST /api/diary` - Create new diary entry
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ "book_id": int, "entry_text": string }`
  - Returns: DiaryEntry object

- `PUT /api/diary/{entry_id}` - Update diary entry
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ "entry_text": string }`
  - Returns: Updated DiaryEntry object

- `DELETE /api/diary/{entry_id}` - Delete diary entry
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ "message": string }`

### Ratings
- `GET /api/ratings` - Get all user's ratings
  - Headers: `Authorization: Bearer {token}`
  - Returns: Array of Rating objects with book info

- `GET /api/ratings/top10` - Get top 10 rated books
  - Headers: `Authorization: Bearer {token}`
  - Returns: Array of top 10 Rating objects with book info

- `GET /api/ratings/{book_id}` - Get rating for specific book
  - Headers: `Authorization: Bearer {token}`
  - Returns: Rating object with book info

- `POST /api/ratings` - Create/update rating for a book
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ "book_id": int, "rating": int (1-5) }`
  - Returns: Rating object

- `DELETE /api/ratings/{rating_id}` - Delete a rating
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ "message": string }`

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Vercel account with Vercel Postgres database

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Database Setup
1. Create a Vercel Postgres database in your Vercel project
2. Set the `DATABASE_URL` environment variable in Vercel
3. Run the database initialization script:
```bash
cd backend
python -m models.init_db
```

### Environment Variables
Set these in Vercel:
- `DATABASE_URL`: PostgreSQL connection string from Vercel Postgres
- `SECRET_KEY`: Secret key for JWT token signing (generate a secure random string)

### Deployment
1. Connect your repository to Vercel
2. Configure build settings:
   - Root directory: Leave empty (or set to project root)
   - Framework preset: Next.js (for frontend)
3. Add environment variables in Vercel dashboard
4. Deploy!

## Development Status

✅ **Backend API**: Complete
- Authentication endpoints
- Book search and management
- Diary entries CRUD
- Ratings CRUD
- Database models and schema

🚧 **Frontend**: In Progress
- PWA setup complete
- Theme system configured
- Authentication pages: Pending
- Book search page: Pending
- Book detail page: Pending
- User dashboard: Pending
- Star rating component: Pending

⏳ **Future Features**:
- XP/progression system (to be defined)

## Technology Decisions

- **Frontend**: React Native Web with TypeScript
- **Book API**: Open Library API
- **Backend**: FastAPI
- **Database**: Vercel Postgres
- **Authentication**: Password hashing with bcrypt, JWT tokens

## License

See LICENSE file for details.
