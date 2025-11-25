# BlueberryBooks

All-in-one book diary for reviews and ratings - A Progressive Web App (PWA) for tracking your reading journey.

## Overview

BlueberryBooks is a mobile-first book diary application that allows users to track their reading, write personal diary entries, rate books, and view their reading history. The app features a simple, warm design with a progression system to gamify the reading experience.

## Tech Stack

- **Frontend**: React Native Web with TypeScript, Next.js 14 (App Router)
- **Backend**: FastAPI (Python) with Vercel Serverless Functions
- **Database**: 
  - Local Development: SQLite (default, zero setup)
  - Production: Vercel Postgres (PostgreSQL)
- **Book API**: Open Library API (free, no API key required)
- **Authentication**: Password hashing with bcrypt, JWT tokens
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

### Social Features
- **User Search**: Search for other users by username
- **User Profiles**: View other users' profiles with their top 10 rated books and reviews
- **Follow System**: Follow other users to see their profiles and top rated books
- **Friends**: When two users follow each other, they are marked as friends
- **Privacy Controls**: Users can set their profile to private (only followers can view)
- **Profile Settings**: Manage privacy settings from the profile page
- **Follower/Following Counts**: See how many users follow you and who you're following

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
- `is_private`: Privacy setting (0 = public, 1 = private)
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

### Follows (Social)
- `id`: Unique follow relationship identifier
- `follower_id`: Foreign key to Users (user who is following)
- `followed_id`: Foreign key to Users (user being followed)
- `created_at`: Timestamp when follow relationship was created
- **Unique Constraint**: One follow relationship per user pair

## Project Structure

```
BlueberryBooks/
├── frontend/              # React Native Web frontend
│   ├── src/
│   │   ├── app/          # Next.js app directory (pages)
│   │   │   ├── page.tsx  # Home page
│   │   │   ├── login/    # Login page
│   │   │   ├── register/ # Register page
│   │   │   ├── search/   # Book search page
│   │   │   ├── dashboard/# User dashboard
│   │   │   ├── book/[id]/# Book detail page
│   │   │   ├── users/    # User social features
│   │   │   │   ├── search/# User search page
│   │   │   │   └── [id]/  # User profile page
│   │   │   └── profile/  # Profile settings page
│   │   ├── components/   # React components
│   │   │   ├── StarRating.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/      # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── lib/          # Utilities
│   │   │   └── api.ts    # API client
│   │   └── theme/        # Theme configuration
│   ├── public/           # Static assets
│   │   ├── manifest.json # PWA manifest
│   │   └── sw.js        # Service worker
│   └── package.json
├── backend/              # Python backend API
│   ├── api/              # FastAPI application
│   │   └── index.py     # Main app with route mounting
│   ├── models/           # Database models
│   │   ├── database.py  # DB connection (SQLite/PostgreSQL)
│   │   ├── models.py    # SQLAlchemy models
│   │   ├── init_db.py   # Database initialization
│   │   └── migrate_social_features.py # Social features migration
│   ├── routes/           # API route handlers
│   │   ├── auth.py      # Authentication routes
│   │   ├── books.py     # Book routes
│   │   ├── diary.py     # Diary entry routes
│   │   ├── ratings.py    # Rating routes
│   │   └── users.py     # User social routes
│   ├── utils/            # Utility functions
│   │   ├── auth.py      # Password hashing, JWT
│   │   └── open_library.py # Open Library API client
│   ├── requirements.txt
│   └── blueberrybooks.db # SQLite database (local dev)
├── vercel.json           # Vercel configuration
├── README.md
└── docs/                 # Documentation
    ├── SETUP.md          # Detailed setup guide
    ├── DEPLOYMENT.md      # Deployment instructions
    ├── DEPLOY_QUICK_START.md # Quick deployment guide
    └── ...                # Other documentation files
```

## Documentation

All detailed documentation is available in the [`docs/`](./docs/) folder:

- **[Setup Guide](./docs/SETUP.md)** - Complete local development setup
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Comprehensive Vercel deployment
- **[Quick Deploy](./docs/DEPLOY_QUICK_START.md)** - 5-minute deployment guide
- **[Environment Variables](./docs/ENV_VARIABLES_GUIDE.md)** - Detailed env var setup
- **[Troubleshooting](./docs/VERCEL_BUILD_FIX.md)** - Build and deployment fixes

See [docs/README.md](./docs/README.md) for the complete documentation index.

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

### Users (Social Features)
- `GET /api/users/search?q={query}` - Search for users by username
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ "results": [{ "id": int, "username": string, "is_private": bool }] }`

- `GET /api/users/me/profile` - Get current user's own profile
  - Headers: `Authorization: Bearer {token}`
  - Returns: UserProfile object with follower/following counts

- `GET /api/users/{user_id}/profile` - Get another user's profile
  - Headers: `Authorization: Bearer {token}`
  - Returns: UserProfileWithBooks object (includes top 10 rated books and reviews if accessible)
  - Respects privacy settings (private profiles only visible to followers)

- `POST /api/users/{user_id}/follow` - Follow a user
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ "message": string }`

- `DELETE /api/users/{user_id}/follow` - Unfollow a user
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ "message": string }`

- `PUT /api/users/me/privacy` - Update privacy setting
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ "is_private": bool }`
  - Returns: `{ "message": string, "is_private": bool }`

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Vercel account with Vercel Postgres database

### Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file (see Environment Variables section)
npm run dev
```
The frontend will be available at `http://localhost:3000`

### Backend Setup
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Run the server
uvicorn api.index:app --reload --port 8000
```
The API will be available at `http://localhost:8000/api`
API documentation at `http://localhost:8000/api/docs` (when running locally)

### Database Setup

#### Local Development
For local development, the app uses SQLite by default (no setup required). The database file will be created automatically at `backend/blueberrybooks.db`.

To use PostgreSQL locally instead:
1. Create a `.env` file in the `backend` directory:
```
DATABASE_URL=postgresql://user:password@localhost/blueberrybooks
SECRET_KEY=your-secret-key-here
```

2. Initialize the database:
```bash
cd backend
python -m models.init_db
```

#### Production (Vercel)
1. Create a Vercel Postgres database in your Vercel project
2. Set the `DATABASE_URL` environment variable in Vercel
3. Initialize the database and run migrations:
   ```bash
   cd backend
   vercel env pull .env.local  # Pull environment variables
   python -m models.init_db    # Create tables
   python -m models.migrate_social_features  # Add social features
   ```

### Environment Variables

#### Frontend
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Backend (Local)
Create `backend/.env.local` or `backend/.env`:
```
DEV_DATABASE_URL=sqlite:///./blueberrybooks.db  # SQLite for local development
SECRET_KEY=your-secret-key-here-change-in-production
```

**Note**: The app automatically uses `DEV_DATABASE_URL` for local development and `DATABASE_URL` for production (Vercel). If `DEV_DATABASE_URL` is not set, it defaults to SQLite.

#### Vercel (Production)
Set these in Vercel project settings:
- `DATABASE_URL`: PostgreSQL connection string from Vercel Postgres
- `SECRET_KEY`: Secret key for JWT token signing (generate with: `openssl rand -hex 32`)
- `VERCEL`: Automatically set by Vercel (used to detect environment)

### Deployment
1. Connect your repository to Vercel
2. Configure build settings:
   - Root directory: Leave empty (or set to project root)
   - Framework preset: Next.js (for frontend)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your Vercel Postgres connection string
   - `SECRET_KEY`: Generate with `openssl rand -hex 32`
   - `VERCEL`: Automatically set by Vercel (don't set manually)
4. Deploy!

**Note**: The backend automatically detects the environment (local vs Vercel) and handles API routing accordingly. Routes are prefixed with `/api` locally but not on Vercel (Vercel's routing handles it).

## Development Status

✅ **Backend API**: Complete
- Authentication endpoints (register, login)
- Book search and management (Open Library integration)
- Diary entries CRUD operations
- Ratings CRUD operations
- User social features (search, profiles, follow/unfollow, privacy)
- Database models and schema
- SQLite support for local development (via DEV_DATABASE_URL)
- PostgreSQL support for production (via DATABASE_URL)
- Automatic environment detection (local vs Vercel)
- Automatic API prefix handling (local vs Vercel)

✅ **Frontend**: Complete
- PWA setup with service worker and manifest
- Theme system (warm brown colors, white background)
- Authentication pages (login, register)
- Book search page with Open Library integration
- Book detail page (view, rate, diary entry, mark as read)
- User dashboard (read books, top 10 rated, diary entries)
- User search page (find other users)
- User profile pages (view top 10 books and reviews)
- Profile settings page (privacy controls)
- Follow/unfollow functionality
- Star rating component (1-5 stars)
- Protected routes and authentication context
- Responsive design

⏳ **Future Features**:
- XP/progression system (to be defined)

## Technology Decisions

- **Frontend**: React Native Web with TypeScript, Next.js 14 (App Router)
- **Book API**: Open Library API (free, no API key required)
- **Backend**: FastAPI with automatic API documentation
- **Database**: 
  - Local: SQLite (default via DEV_DATABASE_URL, no setup required)
  - Production: Vercel Postgres (PostgreSQL via DATABASE_URL)
  - Automatic environment detection and database selection
- **Authentication**: Password hashing with bcrypt, JWT tokens
- **Deployment**: Vercel (serverless functions for both frontend and backend)

## Key Features

- **Zero-config local development**: SQLite database (via DEV_DATABASE_URL), automatic API prefix handling
- **Social features**: User profiles, follow system, privacy controls
- **Environment-aware**: Automatically uses correct database and settings for local vs production
- **PWA ready**: Service worker and manifest configured for mobile installation
- **Responsive design**: Works on desktop, tablet, and mobile devices
- **Type-safe**: Full TypeScript support in frontend
- **RESTful API**: Well-structured endpoints with automatic documentation

## License

See LICENSE file for details.
