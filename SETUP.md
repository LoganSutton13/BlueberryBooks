# BlueberryBooks Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Vercel account (for deployment)
- Git

### 2. Local Development Setup

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`

#### Backend Setup
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

#### Database Setup (Local)
For local development, you can use a local PostgreSQL database or SQLite (modify `database.py` for SQLite).

1. Create a `.env` file in the `backend` directory:
```
DATABASE_URL=postgresql://user:password@localhost/blueberrybooks
SECRET_KEY=your-secret-key-here-change-in-production
```

2. Initialize the database:
```bash
cd backend
python -m models.init_db
```

3. Run the FastAPI server:
```bash
uvicorn api.index:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### 3. Vercel Deployment

#### Step 1: Connect Repository
1. Push your code to GitHub/GitLab/Bitbucket
2. Import the repository in Vercel

#### Step 2: Set Up Vercel Postgres
1. In your Vercel project, go to Storage
2. Create a new Vercel Postgres database
3. Note the connection string

#### Step 3: Environment Variables
In Vercel project settings, add:
- `DATABASE_URL`: Your Vercel Postgres connection string
- `SECRET_KEY`: A secure random string for JWT signing (generate with: `openssl rand -hex 32`)

#### Step 4: Initialize Database
After deployment, you'll need to initialize the database. You can:
1. Use Vercel's CLI to run the init script
2. Or manually run SQL migrations (see `backend/models/models.py` for schema)

#### Step 5: Deploy
Vercel will automatically deploy on push to your main branch.

## Project Structure

```
BlueberryBooks/
├── frontend/              # Next.js + React Native Web
│   ├── src/
│   │   ├── app/          # Next.js app directory (pages)
│   │   ├── theme/        # Theme colors
│   │   └── components/   # Reusable components
│   ├── public/           # Static files, manifest, service worker
│   └── package.json
├── backend/              # FastAPI backend
│   ├── api/              # Main FastAPI app
│   ├── models/           # Database models
│   ├── routes/           # API route handlers
│   ├── utils/            # Utilities (auth, Open Library API)
│   └── requirements.txt
├── vercel.json           # Vercel configuration
└── README.md
```

## API Base URL

- **Local**: `http://localhost:8000/api`
- **Production**: `https://your-domain.vercel.app/api`

## Testing the API

### Register a User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

### Search Books
```bash
curl "http://localhost:8000/api/books/search?q=harry+potter&limit=5"
```

## Next Steps

1. **Frontend Development**: Build the React Native Web pages
   - Authentication pages (login/register)
   - Book search page
   - Book detail page
   - User dashboard

2. **Testing**: Add unit tests and integration tests

3. **XP System**: Implement the progression system (to be defined)

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check that PostgreSQL is running (if local)
- Ensure Vercel Postgres database is created and accessible

### Import Errors
- Make sure all dependencies are installed
- Check Python path and virtual environment activation
- Verify import paths match the project structure

### CORS Issues
- Update `allow_origins` in `backend/api/index.py` with your frontend URL
- For production, replace `["*"]` with your actual domain

## Support

For issues or questions, refer to the main README.md or create an issue in the repository.

