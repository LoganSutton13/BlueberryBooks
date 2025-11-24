# Vercel Deployment Checklist

## Pre-Deployment Setup

### 1. Code Preparation
- [ ] All code is committed and pushed to Git
- [ ] Working tree is clean (`git status` shows nothing to commit)
- [ ] All files are in the correct directories

### 2. Vercel Project Configuration

**IMPORTANT**: When creating/importing the project in Vercel:

- [ ] **Root Directory**: Set to `frontend` (CRITICAL - this prevents "No Next.js version detected" error)
- [ ] **Framework Preset**: Should auto-detect as Next.js
- [ ] **Build Command**: Leave default (Next.js auto-detects)
- [ ] **Output Directory**: Leave default

### 3. Database Setup

- [ ] Create Neon database via Vercel Storage
  - Go to Vercel Dashboard → Storage → Create Database
  - Select **Neon** (Serverless Postgres)
  - Name it (e.g., `blueberrybooks-db`)
  - Copy the connection string

### 4. Environment Variables

Set these in **Vercel Dashboard → Settings → Environment Variables**:

- [ ] **DATABASE_URL**
  - Value: Your Neon connection string
  - Format: `postgresql://user:password@host.neon.tech/dbname`
  - Environments: Production, Preview, Development

- [ ] **SECRET_KEY**
  - Generate with: `openssl rand -hex 32`
  - Or use: https://generate-secret.vercel.app/32
  - Environments: Production, Preview, Development

- [ ] **NEXT_PUBLIC_API_URL**
  - Value: `https://your-project-name.vercel.app/api`
  - Replace `your-project-name` with your actual Vercel project name
  - Environments: Production, Preview, Development

### 5. Initial Deployment

- [ ] Deploy the project (Vercel will build automatically)
- [ ] Check build logs for any errors
- [ ] Verify deployment URL is accessible

### 6. Database Initialization

After first successful deployment:

- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`
- [ ] Link project: `vercel link`
- [ ] Pull env vars: `vercel env pull .env.local`
- [ ] Initialize database:
  ```bash
  cd backend
  python -m models.init_db
  ```

### 7. Redeploy

- [ ] After setting environment variables, redeploy:
  - Go to Deployments → Click ⋯ → Redeploy
  - Or push a new commit

### 8. Verification

Test all features:

- [ ] Visit your deployment URL
- [ ] Register a new account
- [ ] Login works
- [ ] Search for books works
- [ ] Can rate books (1-5 stars)
- [ ] Can add diary entries
- [ ] Dashboard displays:
  - [ ] All read books
  - [ ] Top 10 rated books
  - [ ] Diary entries

## Troubleshooting

### Build Fails with "No Next.js version detected"
- **Fix**: Set Root Directory to `frontend` in Vercel project settings

### Database Connection Errors
- Check `DATABASE_URL` is set correctly
- Verify Neon database is active
- Ensure database tables are initialized

### API 404 Errors
- Verify `NEXT_PUBLIC_API_URL` matches your deployment URL
- Check that backend routes are configured in `vercel.json`

### CORS Errors
- Update `allow_origins` in `backend/api/index.py` with your Vercel URL

## Files Required for Deployment

✅ **Already in place:**
- `vercel.json` - Vercel configuration
- `backend/api/requirements.txt` - Python dependencies for Vercel
- `backend/api/index.py` - FastAPI app entry point
- `.vercelignore` - Files to exclude from deployment
- `frontend/next.config.js` - Next.js configuration
- `frontend/package.json` - Frontend dependencies

## Quick Deploy Command

```bash
# If using Vercel CLI
vercel --prod
```

## Post-Deployment

- [ ] Update CORS in `backend/api/index.py` with your production URL
- [ ] Set up custom domain (optional)
- [ ] Monitor function logs for errors
- [ ] Set up alerts for critical errors

