# Two-Project Vercel Deployment Guide

This guide explains how to deploy BlueberryBooks using **two separate Vercel projects** - one for the frontend and one for the backend. This is the **recommended approach** as it's simpler and more reliable.

## Overview

- **Frontend Project**: Next.js app (Root: `frontend`)
- **Backend Project**: Python FastAPI (Root: project root)

## Step 1: Create Backend Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your Git repository
4. Configure:
   - **Project Name**: `blueberrybooks-api` (or your choice)
   - **Framework Preset**: **Other**
   - **Root Directory**: Leave empty (project root)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. Click **Deploy**

### Backend Environment Variables

In the backend project settings → **Environment Variables**, add:

- **DATABASE_URL**: Your Neon Postgres connection string
- **SECRET_KEY**: Generate with `openssl rand -hex 32`
- **PYTHON_VERSION**: `3.9` (optional, can be in vercel.json)

**Important**: Copy the backend deployment URL (e.g., `https://blueberrybooks-api.vercel.app`)

## Step 2: Create Frontend Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import the **same Git repository**
4. Configure:
   - **Project Name**: `blueberrybooks` (or your choice)
   - **Framework Preset**: **Next.js** (auto-detected)
   - **Root Directory**: `frontend` ⚠️ **CRITICAL**
   - **Build Command**: Leave default
   - **Output Directory**: Leave default
5. Click **Deploy**

### Frontend Environment Variables

In the frontend project settings → **Environment Variables**, add:

- **NEXT_PUBLIC_API_URL**: `https://blueberrybooks-api.vercel.app/api`
  - Replace `blueberrybooks-api` with your actual backend project name
  - Must end with `/api`

## Step 3: Initialize Database

After both projects are deployed, you need to create the database tables. The initialization script will:
- Create 5 tables: `users`, `books`, `diary_entries`, `ratings`, `read_books`
- Set up foreign keys and relationships between tables
- Add indexes for performance
- Apply constraints (unique usernames, one rating per user per book, etc.)

**How it works:**
- The script runs **locally on your computer**
- But it connects to your **remote Vercel-hosted PostgreSQL database**
- The `vercel env pull` command downloads the `DATABASE_URL` which contains the connection string to your Vercel database
- When you run `python -m models.init_db`, it uses that connection string to create tables in the remote database

**Note**: You only need to run this **once** after the first deployment. The tables will persist in your database.

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Link to backend project
cd backend
vercel link
# Select your backend project when prompted

# Pull environment variables from Vercel (creates .env.local file)
# This downloads DATABASE_URL and SECRET_KEY from your Vercel backend project
vercel env pull .env.local

# Verify .env.local was created and contains DATABASE_URL
# You should see a file at: backend/.env.local (or root/.env.local)

# Initialize database (creates all required tables in your Vercel database)
# NOTE: This script runs on YOUR computer but connects to the REMOTE Vercel database
# The DATABASE_URL in .env.local points to your Vercel-hosted PostgreSQL database
# This creates: users, books, diary_entries, ratings, read_books tables
cd backend
python -m models.init_db

# You should see: "✅ Database tables created successfully!"
```

## Step 4: Verify Deployment

1. **Frontend**: Visit `https://blueberrybooks.vercel.app`
   - Should show the login/register page
   - Should NOT show 404

2. **Backend**: Visit `https://blueberrybooks-api.vercel.app/health`
   - Should return `{"status": "healthy"}`

3. **API**: Visit `https://blueberrybooks-api.vercel.app/api/health`
   - Should return API response

## Project Structure

```
BlueberryBooks/
├── vercel.json          # For BACKEND project only
├── backend/
│   └── api/
│       └── index.py
└── frontend/
    ├── package.json
    └── src/
        └── app/
```

## Important Notes

- **Two separate projects** = Two separate deployments
- **Backend project** uses `vercel.json` at root
- **Frontend project** has Root Directory = `frontend` (no vercel.json needed)
- **Environment variables** are set per project
- **Database** is shared via `DATABASE_URL` in backend project

## Troubleshooting

### Frontend shows 404
- ✅ Check Root Directory is set to `frontend`
- ✅ Verify Next.js is detected in build logs
- ✅ Check that `frontend/package.json` exists

### API calls fail
- ✅ Verify `NEXT_PUBLIC_API_URL` points to backend project URL
- ✅ Check backend project is deployed and accessible
- ✅ Test backend directly: `https://your-backend.vercel.app/health`

### Database errors / No tables in database
- ✅ Verify `DATABASE_URL` is set in **backend project** only
- ✅ Run database initialization script
- ✅ Check database is active in Vercel Storage
- ✅ **If no tables exist:**
  1. Make sure you ran `vercel env pull .env.local` from the `backend` directory
  2. Verify `.env.local` file exists and contains `DATABASE_URL`
  3. Check that `DATABASE_URL` points to your Vercel database (should start with `postgresql://`)
  4. Run `python -m models.init_db` from the `backend` directory
  5. You should see "✅ Database tables created successfully!"
  6. If you get Python 3.13 errors, upgrade SQLAlchemy: `pip install --upgrade sqlalchemy`

## Benefits of Two Projects

1. ✅ **Independent deployments** - Update frontend without affecting backend
2. ✅ **Clear separation** - Each service has its own settings
3. ✅ **Easier debugging** - Separate logs and build outputs
4. ✅ **Better scaling** - Can scale frontend and backend independently
5. ✅ **Simpler configuration** - No complex routing in vercel.json

## Alternative: Single Project

If you prefer a single project, you can:
1. Set Root Directory to `frontend`
2. Use Next.js API routes or rewrites to proxy to backend
3. Deploy backend as serverless functions within Next.js

However, the two-project approach is recommended for this architecture.

