# Quick Deploy to Vercel

## Step-by-Step (5 minutes)

### 1. Create Database
```
Vercel Dashboard → Storage → Create Database → Neon
Copy connection string!
```

### 2. Import Project
```
Vercel Dashboard → Add New → Project → Import Git Repo
```

### 3. Configure Project
**CRITICAL**: Set **Root Directory** to: `frontend`

### 4. Set Environment Variables
In Vercel project settings → Environment Variables:

**DATABASE_URL**
- Get from: Vercel Dashboard → Storage → Your Neon DB → Connection String
- Example: `postgresql://user:pass@ep-xxx.neon.tech/db`
- Select: Production, Preview, Development

**SECRET_KEY**
- Generate: `openssl rand -hex 32` (or use https://generate-secret.vercel.app/32)
- Example: `a1b2c3d4e5f6...` (64 character hex string)
- Select: Production, Preview, Development

**NEXT_PUBLIC_API_URL**
- Value: `https://your-project-name.vercel.app/api`
- Replace `your-project-name` with your actual Vercel project name
- Select: Production, Preview, Development

📖 **Detailed guide**: See [ENV_VARIABLES_GUIDE.md](./ENV_VARIABLES_GUIDE.md) for step-by-step instructions

### 5. Deploy
Click **Deploy** and wait for build to complete.

### 6. Initialize Database
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
cd backend
python -m models.init_db
```

### 7. Redeploy
After setting env vars, redeploy from Vercel dashboard.

## ✅ Done!

Visit your site and test:
- Register → Login → Search books → Rate → Add diary entry

## Common Issues

**"No Next.js version detected"**
→ Set Root Directory to `frontend` in project settings

**Database errors**
→ Check DATABASE_URL and initialize database

**API 404**
→ Verify NEXT_PUBLIC_API_URL matches your deployment URL

For detailed instructions, see [VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md)

