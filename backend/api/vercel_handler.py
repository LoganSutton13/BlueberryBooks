"""Vercel serverless function handler for FastAPI"""
from api.index import app

# This is the handler that Vercel will use
handler = app

