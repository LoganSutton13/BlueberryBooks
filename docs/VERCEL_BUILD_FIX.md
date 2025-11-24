# Fix: Module Not Found Errors in Vercel Build

## Problem
Build fails with: `Module not found: Can't resolve '@/lib/api'`

## Solution

### Option 1: Set Root Directory in Vercel (Recommended)

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **General**
2. Scroll to **Root Directory**
3. Set it to: `frontend`
4. **Save**
5. **Redeploy**

This allows Vercel to auto-detect Next.js and build from the correct directory.

### Option 2: If Root Directory Setting Doesn't Work

The `vercel.json` has been simplified to only handle the Python backend. Next.js will be auto-detected when Root Directory is set to `frontend`.

## What Changed

- Removed Next.js build config from `vercel.json` (Vercel will auto-detect)
- Added `baseUrl: "."` to `tsconfig.json` for better path resolution
- Simplified `vercel.json` to only handle Python backend routing

## Verify

After setting Root Directory and redeploying:
- Build should complete successfully
- No "Module not found" errors
- Next.js should be detected automatically

