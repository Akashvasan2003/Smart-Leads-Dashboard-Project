# Railway Deployment Guide — Smart Leads Dashboard

## Overview

We deploy 3 services on Railway:
| Service | Type | URL |
|---------|------|-----|
| Backend | Node.js API | https://smart-leads-backend.up.railway.app |
| Frontend | React (Nginx) | https://smart-leads-frontend.up.railway.app |
| MongoDB | Database | Internal Railway URL |

---

## Step 1 — Create Railway Account

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended for auto-deploy)

---

## Step 2 — Create New Project

1. Click **"New Project"**
2. Select **"Empty Project"**
3. Name it: `smart-leads-dashboard`

---

## Step 3 — Deploy MongoDB

1. Inside your project, click **"+ New Service"**
2. Select **"Database"** → **"MongoDB"**
3. Railway will create MongoDB automatically
4. Click on the MongoDB service → **"Variables"** tab
5. Copy the `MONGO_URL` value — you need it for the backend

---

## Step 4 — Deploy Backend

1. Click **"+ New Service"** → **"GitHub Repo"**
2. Select your repo: `Smart-Leads-Dashboard-Project`
3. Click **"Add Variables"** and set:

| Variable | Value |
|----------|-------|
| NODE_ENV | production |
| PORT | 5000 |
| MONGODB_URI | (paste from MongoDB service) |
| JWT_SECRET | your_super_secret_key_min_32_chars |
| JWT_EXPIRES_IN | 7d |
| CORS_ORIGIN | https://your-frontend.up.railway.app |
| RATE_LIMIT_WINDOW_MS | 900000 |
| RATE_LIMIT_MAX | 100 |

4. Under **"Settings"** tab:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/server.js`

5. Click **"Deploy"**

---

## Step 5 — Deploy Frontend

1. Click **"+ New Service"** → **"GitHub Repo"**
2. Select same repo
3. Click **"Add Variables"** and set:

| Variable | Value |
|----------|-------|
| VITE_API_URL | https://your-backend.up.railway.app/api |

4. Under **"Settings"** tab:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -l 3000`

5. Click **"Deploy"**

---

## Step 6 — Configure Custom Domains

### Backend Domain:
1. Click Backend service → **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL (e.g. `smart-leads-backend.up.railway.app`)

### Frontend Domain:
1. Click Frontend service → **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL (e.g. `smart-leads-frontend.up.railway.app`)

---

## Step 7 — Update CORS After Domains Are Set

Go back to **Backend service** → **Variables** → Update:
```
CORS_ORIGIN=https://smart-leads-frontend.up.railway.app
```

Go to **Frontend service** → **Variables** → Update:
```
VITE_API_URL=https://smart-leads-backend.up.railway.app/api
```

Then **redeploy both services**.

---

## Step 8 — Verify Deployment

Test these URLs:

Backend health check:
```
GET https://your-backend.up.railway.app/health
```
Expected:
```json
{ "success": true, "message": "Server is running", "env": "production" }
```

Frontend:
```
https://your-frontend.up.railway.app
```
Should show the Login page.

---

## Auto Deploy on Git Push

Railway automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "your changes"
git push
```
Railway detects the push and redeploys in ~2 minutes ✅

---

## Troubleshooting

### CORS Error
- Make sure `CORS_ORIGIN` in backend matches your exact frontend URL
- No trailing slash: `https://frontend.up.railway.app` ✅ not `https://frontend.up.railway.app/` ❌

### Build Failure
- Check Railway build logs
- Make sure `tsconfig.json` is in the backend root
- Run `npm run build` locally first to verify

### MongoDB Connection Error
- Copy the full `MONGO_URL` from Railway MongoDB service
- Make sure it includes the database name at the end: `.../smart-leads`

### Environment Variable Issues
- Variables starting with `VITE_` are build-time for frontend
- Must redeploy frontend after changing `VITE_API_URL`
- Backend variables are runtime — no rebuild needed

### TypeScript Build Issues
- Railway uses Node 18+ by default
- Add `engines` to package.json if needed:
  ```json
  "engines": { "node": ">=20.0.0" }
  ```
