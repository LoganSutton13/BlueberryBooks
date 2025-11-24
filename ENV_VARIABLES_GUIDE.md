# Environment Variables Setup Guide

## Overview

You need to set **3 environment variables** in Vercel for your app to work properly.

## Step-by-Step: Setting Environment Variables

### 1. Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click on your **BlueberryBooks** project
3. Go to **Settings** → **Environment Variables**

### 2. Add Each Variable

---

## Variable 1: `DATABASE_URL`

### What it is:
The connection string to your Neon PostgreSQL database.

### How to get it:
1. In Vercel Dashboard, go to **Storage**
2. Find your Neon database (the one you created earlier)
3. Click on it
4. Look for **Connection String** or **Connection Details**
5. Copy the entire connection string

### Example format:
```
postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### In Vercel:
- **Name**: `DATABASE_URL`
- **Value**: Paste the connection string you copied
- **Environment**: Select all three:
  - ☑ Production
  - ☑ Preview  
  - ☑ Development
- Click **Save**

---

## Variable 2: `SECRET_KEY`

### What it is:
A secret key used to sign JWT tokens for user authentication. Must be a random, secure string.

### How to generate it:

**Option A: Using PowerShell (Windows)**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Option B: Using OpenSSL (if installed)**
```bash
openssl rand -hex 32
```

**Option C: Online Generator**
Visit: https://generate-secret.vercel.app/32
- Click "Generate"
- Copy the generated string

### Example format:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```
(Actually 64 characters long for hex-32)

### In Vercel:
- **Name**: `SECRET_KEY`
- **Value**: Paste the generated secret key
- **Environment**: Select all three:
  - ☑ Production
  - ☑ Preview
  - ☑ Development
- Click **Save**

**⚠️ Important**: Keep this secret! Don't share it or commit it to Git.

---

## Variable 3: `NEXT_PUBLIC_API_URL`

### What it is:
The base URL where your backend API is accessible. This tells your frontend where to send API requests.

### How to get it:
1. After your first deployment, Vercel will give you a URL
2. It will look like: `https://blueberrybooks-xxxxx.vercel.app`
3. Add `/api` to the end

### Example format:
```
https://blueberrybooks-abc123.vercel.app/api
```

**OR** if you set up a custom domain:
```
https://blueberrybooks.com/api
```

### In Vercel:
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://your-actual-project-name.vercel.app/api`
  - Replace `your-actual-project-name` with your real Vercel project name
- **Environment**: Select all three:
  - ☑ Production
  - ☑ Preview
  - ☑ Development
- Click **Save**

**Note**: For Preview and Development, you might want to use different URLs, but typically you can use the same production URL for all environments.

---

## Quick Reference Table

| Variable Name | Where to Get It | Example Value |
|--------------|----------------|---------------|
| `DATABASE_URL` | Vercel Storage → Your Neon DB → Connection String | `postgresql://user:pass@ep-xxx.neon.tech/db` |
| `SECRET_KEY` | Generate with `openssl rand -hex 32` or online | `a1b2c3d4e5f6...` (64 chars) |
| `NEXT_PUBLIC_API_URL` | Your Vercel deployment URL + `/api` | `https://project.vercel.app/api` |

---

## After Setting Variables

1. **Redeploy** your project (Vercel will use the new env vars)
2. **Initialize database** (see Step 5 in deployment guide)
3. **Test** your app

---

## Troubleshooting

### "Can't find DATABASE_URL"
- Make sure you created the Neon database first
- Check that you copied the entire connection string
- Verify it starts with `postgresql://`

### "Invalid SECRET_KEY"
- Make sure it's at least 32 characters long
- Don't use spaces or special characters (except hex: 0-9, a-f)
- Generate a new one if unsure

### "API calls failing"
- Check that `NEXT_PUBLIC_API_URL` matches your actual Vercel URL
- Make sure it ends with `/api`
- Verify the URL is accessible in your browser

---

## Security Notes

- ✅ `DATABASE_URL` and `SECRET_KEY` are **server-side only** (not exposed to browser)
- ✅ `NEXT_PUBLIC_API_URL` is **public** (starts with `NEXT_PUBLIC_` so it's safe to expose)
- ❌ Never commit these values to Git
- ❌ Never share your `SECRET_KEY` publicly

