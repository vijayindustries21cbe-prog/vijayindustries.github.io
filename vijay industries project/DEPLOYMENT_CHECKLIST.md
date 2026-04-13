# 📦 Deployment Checklist - Files to Include

## ✅ REQUIRED FILES (Must Deploy)

### For Render.com Deployment:

#### Core Application Files
- ✅ **`app.py`** - Flask application (main file)
- ✅ **`requirements.txt`** - Python dependencies
- ✅ **`Procfile`** - Tells Render how to run the app
- ✅ **`runtime.txt`** - Python version specification
- ✅ **`.gitignore`** - Git ignore rules

#### Website Files (code/ folder)
- ✅ **`code/index.html`** - Main HTML file
- ✅ **`code/style.css`** - Stylesheet
- ✅ **`code/script.js`** - JavaScript file
- ✅ **`code/images/`** - Images folder
  - ✅ **`code/images/company logo.png`** - Company logo
  - ✅ **`code/images/9f3739dd-99f1-4966-93df-edd7ad2d8a31.png`** - Other image (if used)

#### Documentation (Optional but Recommended)
- ✅ **`README.md`** - Project documentation

---

### For Vercel Deployment (Alternative):

#### Additional Files Needed:
- ✅ **`vercel.json`** - Vercel configuration
- ✅ **`api/index.py`** - Serverless function wrapper

---

## ❌ FILES TO EXCLUDE (Don't Deploy)

### Data Files (Auto-created)
- ❌ **`data/`** - Entire folder (will be created automatically by Flask)
- ❌ **`data/contacts.json`** - Will be created automatically (already in .gitignore)

### Development/Test Files
- ❌ **`test_api.py`** - Testing script (not needed for deployment)

### Personal/Unrelated Files
- ❌ **`582613807_18091158473496693_8135626413990369772_n.jpg`**
- ❌ **`ChatGPT Image Nov 24, 2025, 09_26_55 PM.png`**
- ❌ **`ChatGPT Image Nov 28, 2025, 06_20_28 PM.png`**
- ❌ **`srcas logo.jpg`**
- ❌ **`Final Project Presentation 1.pptx`**
- ❌ **`Final Project Presentation.pptx`**
- ❌ **`vasan 1st review.pptx`**
- ❌ **`vasan_1st_review.pptx[1].pptx`**

### Documentation Files (Optional - can exclude)
- ❌ **`DEPLOYMENT_FILES.md`** - Deployment guide (optional)
- ❌ **`VERCEL_DEPLOYMENT.md`** - Vercel guide (optional)
- ❌ **`DEPLOYMENT_CHECKLIST.md`** - This file (optional)

---

## 📁 Final Repository Structure

Your GitHub repository should look like this:

```
vijay/
├── app.py                    ✅ REQUIRED
├── requirements.txt          ✅ REQUIRED
├── Procfile                  ✅ REQUIRED (for Render)
├── runtime.txt               ✅ REQUIRED (for Render)
├── .gitignore                ✅ REQUIRED
├── vercel.json               ✅ REQUIRED (for Vercel only)
├── README.md                 ✅ RECOMMENDED
├── api/                      ✅ REQUIRED (for Vercel only)
│   └── index.py             ✅ REQUIRED (for Vercel only)
└── code/                     ✅ REQUIRED
    ├── index.html           ✅ REQUIRED
    ├── style.css            ✅ REQUIRED
    ├── script.js            ✅ REQUIRED
    └── images/              ✅ REQUIRED
        ├── company logo.png ✅ REQUIRED
        └── 9f3739dd-99f1-4966-93df-edd7ad2d8a31.png
```

---

## 🚀 Quick Deployment Steps

### 1. Check Your .gitignore
Your `.gitignore` already excludes:
- `data/` folder ✅
- `*.json` files ✅ (except package.json)
- Personal files ✅

### 2. Verify Required Files Exist
Run this check:
```bash
# Check if all required files exist
ls app.py requirements.txt Procfile runtime.txt code/index.html code/style.css code/script.js
```

### 3. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 4. Deploy on Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Render will auto-detect the Flask app
4. Click "Deploy"

---

## ✅ Pre-Deployment Checklist

Before pushing to GitHub, verify:

- [ ] `app.py` exists in root directory
- [ ] `requirements.txt` exists and has Flask dependencies
- [ ] `Procfile` exists (for Render)
- [ ] `runtime.txt` exists (for Render)
- [ ] `.gitignore` exists
- [ ] `code/` folder exists
- [ ] `code/index.html` exists
- [ ] `code/style.css` exists
- [ ] `code/script.js` exists
- [ ] `code/images/` folder exists
- [ ] `code/images/company logo.png` exists
- [ ] `data/` folder is NOT committed (check .gitignore)
- [ ] Personal/unrelated files are NOT committed

---

## 🔍 Verify What's in Your Repository

To check what files are tracked by Git:

```bash
git ls-files
```

This shows all files that will be pushed to GitHub.

---

## 📝 Notes

1. **Data Folder**: The `data/` folder is already in `.gitignore`, so it won't be uploaded. Flask will create it automatically on the server.

2. **Images**: Make sure ALL images used in your website are in the `code/images/` folder.

3. **File Paths**: All paths in your code use forward slashes (`/`) which work on all platforms.

4. **Most Important**: The `code/` folder MUST be in your GitHub repository. This is critical!

---

## 🆘 If Deployment Fails

1. **Check Render Logs**: Look for error messages about missing files
2. **Verify `code/` folder**: Make sure it's in your GitHub repo
3. **Check file paths**: Ensure all paths use forward slashes (`/`)
4. **Verify dependencies**: Check that `requirements.txt` has all needed packages

---

**Summary**: Deploy everything EXCEPT the `data/` folder and personal/unrelated files. The `.gitignore` file should handle most exclusions automatically.






