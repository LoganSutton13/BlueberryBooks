# Vercel Deployment Guide

This guide will walk you through deploying BlueberryBooks to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Vercel CLI installed (optional, for local testing): `npm i -g vercel`

## Step 1: Prepare Your Repository

Make sure all your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Create Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Storage** in the left sidebar
3. Click **Create Database**
4. Select **Neon** (Serverless Postgres) - This is the recommended option for PostgreSQL
   - Alternative options: **Supabase** or **Prisma Postgres** also work
5. If prompted, sign in/up for Neon (it's free tier is generous)
6. Choose a name (e.g., `blueberrybooks-db`)
7. Select a region closest to your users
8. Click **Create**
9. **Important**: Copy the connection string - you'll need it in the next step
   - It will look like: `postgresql://user:password@host.neon.tech/dbname`

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Next.js (for frontend)
   - **Root Directory**: Leave empty (or set to project root)
   - **Build Command**: Leave default (Next.js auto-detects)
   - **Output Directory**: Leave default
5. Click **Deploy** (we'll add environment variables after)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

## Step 4: Configure Environment Variables

After the initial deployment, configure environment variables:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Your Neon/Supabase/Prisma Postgres connection string |
| `SECRET_KEY` | `your-secret-key` | Generate with: `openssl rand -hex 32` |
| `NEXT_PUBLIC_API_URL` | `https://your-project.vercel.app/api` | Your Vercel deployment URL + `/api` |

### Generate SECRET_KEY

On macOS/Linux:
```bash
openssl rand -hex 32
```

On Windows (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Or use an online generator: https://generate-secret.vercel.app/32

### Environment Variable Setup

For each variable:
1. Enter the **Name**
2. Enter the **Value**
3. Select **Environment**: 
   - Select **Production**, **Preview**, and **Development** (or just Production)
4. Click **Save**

**Important**: After adding environment variables, you need to **redeploy** for them to take effect.

## Step 5: Initialize Database

After deployment, you need to initialize the database tables:

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Link your project: `vercel link`
3. Run the init script:
```bash
vercel env pull .env.local
cd backend
python -m models.init_db
```

### Option B: Using Vercel Functions

Create a temporary function to initialize the database, or use the Vercel dashboard's function logs to run a one-time script.

### Option C: Manual SQL (Advanced)

1. Connect to your Vercel Postgres database using a PostgreSQL client
2. Run the SQL from `backend/models/models.py` to create tables

## Step 6: Update CORS Settings (Optional)

For better security, update CORS in `backend/api/index.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-project.vercel.app"],  # Your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 7: Redeploy

After setting environment variables:

1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**

Or trigger a new deployment by pushing a commit:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## Step 8: Verify Deployment

1. Visit your deployment URL (e.g., `https://blueberrybooks.vercel.app`)
2. Test registration: Create a new account
3. Test login: Sign in with your account
4. Test book search: Search for a book
5. Test features: Rate a book, add a diary entry

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json` and `requirements.txt`
- Verify Node.js and Python versions are compatible

### Database Connection Errors

- Verify `DATABASE_URL` is set correctly
- Check that your Neon/Supabase/Prisma database is created and active
- Ensure database tables are initialized
- For Neon: Check your Neon dashboard to ensure the database is running

### API 404 Errors

- Check that routes are configured correctly in `vercel.json`
- Verify environment variables are set
- Check function logs in Vercel dashboard

### CORS Errors

- Update `allow_origins` in `backend/api/index.py` with your Vercel URL
- Ensure `NEXT_PUBLIC_API_URL` matches your deployment URL

### Frontend Can't Connect to Backend

- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check that backend is deployed and accessible
- Look at browser console for specific errors

## Post-Deployment Checklist

- [ ] Database initialized with tables
- [ ] Environment variables set
- [ ] Can register new users
- [ ] Can login
- [ ] Can search books
- [ ] Can rate books
- [ ] Can add diary entries
- [ ] Dashboard displays data correctly
- [ ] CORS configured (if needed)

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_API_URL` if needed

## Monitoring

- Check **Analytics** tab for usage stats
- Monitor **Function Logs** for errors
- Set up **Alerts** for critical errors

## Need Help?

- Check Vercel documentation: https://vercel.com/docs
- Review function logs in Vercel dashboard
- Check browser console for frontend errors
- Review API responses in Network tab

