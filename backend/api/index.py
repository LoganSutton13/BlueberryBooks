"""Main FastAPI application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import sys
import os

# Add parent directory to path to import routes
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from routes import auth, books, diary, ratings

# Check if we're running locally (for local dev, we need /api prefix)
# In Vercel, the /api prefix is handled by routing, so we don't add it here
IS_LOCAL = os.getenv("VERCEL") is None
API_PREFIX = "/api" if IS_LOCAL else ""

app = FastAPI(
    title="BlueberryBooks API",
    description="API for BlueberryBooks - A book diary application",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with optional /api prefix for local development
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(books.router, prefix=API_PREFIX)
app.include_router(diary.router, prefix=API_PREFIX)
app.include_router(ratings.router, prefix=API_PREFIX)


@app.get("/")
async def root():
    """Root endpoint"""
    return JSONResponse({"message": "BlueberryBooks API", "version": "0.1.0"})


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse({"status": "healthy"})

