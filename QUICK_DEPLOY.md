# Quick Deployment Checklist

## Pre-Deployment

- [ ] Code is committed and pushed to Git
- [ ] All tests pass locally
- [ ] Frontend runs: `cd frontend && npm run dev`
- [ ] Backend runs: `cd backend && uvicorn api.index:app --reload`

## Deployment Steps

### 1. Create Vercel Postgres Database
```
Vercel Dashboard → Storage → Create Database → Postgres
Copy the connection string!
```

### 2. Deploy to Vercel
```
Vercel Dashboard → Add New → Project → Import Git Repository
```

### 3. Set Environment Variables
In Vercel project settings, add:

**DATABASE_URL**
```
postgresql://user:password@host:port/database
(From Vercel Postgres connection string)
```

**SECRET_KEY**
```bash
# Generate with:
openssl rand -hex 32
```

**NEXT_PUBLIC_API_URL**
```
https://your-project-name.vercel.app/api
(Replace with your actual Vercel URL)
```

### 4. Initialize Database
After first deployment, run:
```bash
vercel env pull .env.local
cd backend
python -m models.init_db
```

Or use Vercel CLI:
```bash
vercel link
vercel env pull
cd backend
python -m models.init_db
```

### 5. Redeploy
After setting environment variables:
```
Vercel Dashboard → Deployments → Redeploy
```

## Verify

- [ ] Visit your site: `https://your-project.vercel.app`
- [ ] Register a new account
- [ ] Login works
- [ ] Search for books works
- [ ] Can rate books
- [ ] Can add diary entries
- [ ] Dashboard displays data

## Common Issues

**Build fails?** Check build logs in Vercel dashboard

**Database errors?** Make sure DATABASE_URL is set and database is initialized

**API 404?** Check that NEXT_PUBLIC_API_URL matches your deployment URL

**CORS errors?** Update CORS in `backend/api/index.py` with your Vercel URL

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

