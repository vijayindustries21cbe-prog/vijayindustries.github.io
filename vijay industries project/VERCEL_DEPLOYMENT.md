# Vercel Deployment Guide

## ✅ Files Created/Updated for Vercel

1. **`vercel.json`** - Vercel configuration file
2. **`api/index.py`** - Serverless function wrapper for Flask
3. **`app.py`** - Updated to handle Vercel's serverless environment
4. **`requirements.txt`** - Updated (removed gunicorn, not needed for Vercel)

## 📁 Required Files Structure

Your repository should have:

```
vijay/
├── vercel.json          ✅ NEW - Vercel configuration
├── api/
│   └── index.py         ✅ NEW - Serverless function
├── app.py               ✅ UPDATED - Flask app
├── requirements.txt     ✅ UPDATED - Dependencies
├── code/                ✅ REQUIRED
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── images/
│       └── company logo.png
└── README.md
```

## 🚀 Deployment Steps

### 1. Push to GitHub

Make sure all files are committed and pushed:

```bash
git add .
git commit -m "Add Vercel serverless configuration"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository: `rohith747/vijay`
4. Vercel will auto-detect:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: (leave empty - not needed)
   - **Output Directory**: (leave empty)
5. Click **"Deploy"**

### 3. Important Notes

#### ⚠️ Data Storage Limitation

**Vercel's serverless functions have a read-only file system** (except `/tmp`).

- Contact form submissions will be stored in `/tmp/data/contacts.json`
- **This data is NOT persistent** - it will be lost when the function restarts
- For production, you should use:
  - **Vercel KV** (key-value store)
  - **Vercel Postgres** (database)
  - **External database** (MongoDB, PostgreSQL, etc.)
  - **Email service** (SendGrid, Mailgun, etc.)

#### 📝 Environment Variables (Optional)

If you need to add environment variables:

1. Go to your Vercel project settings
2. Navigate to **"Environment Variables"**
3. Add variables like:
   - `SECRET_KEY` - Flask secret key
   - `DATABASE_URL` - If using external database
   - `EMAIL_API_KEY` - If using email service

## 🔍 Troubleshooting

### Error: "FUNCTION_INVOCATION_FAILED"

**Common causes:**

1. **Missing `code/` folder** - Make sure `code/` folder is in your GitHub repo
2. **Missing `api/index.py`** - The serverless function wrapper must exist
3. **Import errors** - Check that `app.py` is in the root directory
4. **Path issues** - The app should auto-detect paths, but verify file structure

### Check Vercel Logs

1. Go to your Vercel project dashboard
2. Click on **"Deployments"**
3. Click on the failed deployment
4. Check **"Function Logs"** for detailed error messages

### Verify File Structure

Make sure your GitHub repository has:

```
✅ vercel.json (in root)
✅ api/index.py (in api/ folder)
✅ app.py (in root)
✅ code/ folder (with all website files)
✅ requirements.txt (in root)
```

## 🧪 Testing Locally

You can test the Flask app locally (not the Vercel function):

```bash
python app.py
```

Then visit: `http://localhost:5000`

## 📊 What Changed?

### Before (Render/Heroku style):
- Traditional server deployment
- Persistent file system
- Uses `gunicorn` for production

### After (Vercel serverless):
- Serverless functions
- Read-only file system (except `/tmp`)
- No `gunicorn` needed
- Auto-scaling
- Pay-per-use pricing

## ✅ Next Steps

1. **Push all files to GitHub**
2. **Deploy on Vercel**
3. **Test the website**
4. **Set up persistent storage** (database) for production use

## 🔗 Useful Links

- [Vercel Python Documentation](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Vercel KV (Key-Value Store)](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

---

**Note**: The website should work now! If you still get errors, check the Vercel function logs for specific error messages.


