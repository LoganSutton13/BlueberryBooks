# Fix: "No Next.js version detected" Error

## Problem
Vercel is trying to build from the root directory, but your Next.js app is in the `frontend/` folder.

## Solution

### Option 1: Set Root Directory in Vercel Dashboard (Easiest)

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Settings** → **General**
3. Scroll down to **Root Directory**
4. Click **Edit**
5. Enter: `frontend`
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** on the latest deployment

### Option 2: Configure During Project Creation

If you're creating a new project:

1. When importing your repository, click **Configure Project**
2. Set **Root Directory** to: `frontend`
3. Framework Preset should auto-detect as **Next.js**
4. Click **Deploy**

### Option 3: Use Vercel CLI

```bash
# Link your project
vercel link

# Set root directory
vercel --cwd frontend
```

## Verify

After setting the root directory, the build should:
- Find `frontend/package.json`
- Detect Next.js correctly
- Build successfully

## Still Having Issues?

If you still get errors:

1. Check that `frontend/package.json` has `next` in dependencies
2. Verify the root directory is exactly `frontend` (not `./frontend` or `/frontend`)
3. Try deleting the project and recreating it with the root directory set from the start

