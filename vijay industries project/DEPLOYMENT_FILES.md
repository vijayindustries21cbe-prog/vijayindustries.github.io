# Files to Include in GitHub Repository for Render Deployment

## ✅ REQUIRED FILES (Must Include)

### Core Application Files
- ✅ `app.py` - Flask application (main file)
- ✅ `requirements.txt` - Python dependencies
- ✅ `Procfile` - Deployment configuration for Render
- ✅ `runtime.txt` - Python version specification
- ✅ `.gitignore` - Git ignore rules

### Website Files (code/ folder)
- ✅ `code/index.html` - Main HTML file
- ✅ `code/style.css` - Stylesheet
- ✅ `code/script.js` - JavaScript file
- ✅ `code/images/` - All images folder
  - ✅ `code/images/company logo.png` - Company logo
  - ✅ `code/images/` - Any other images

### Documentation (Optional but Recommended)
- ✅ `README.md` - Project documentation

---

## ❌ FILES TO EXCLUDE (Don't Upload)

### Data Files (Auto-created on server)
- ❌ `data/` - Entire folder (will be created automatically)
- ❌ `data/contacts.json` - Will be created by Flask

### Development/Test Files
- ❌ `test_api.py` - Testing script (not needed for deployment)

### Personal/Unrelated Files
- ❌ `582613807_18091158473496693_8135626413990369772_n.jpg`
- ❌ `ChatGPT Image Nov 24, 2025, 09_26_55 PM.png`
- ❌ `ChatGPT Image Nov 28, 2025, 06_20_28 PM.png`
- ❌ `srcas logo.jpg`
- ❌ `Final Project Presentation 1.pptx`
- ❌ `Final Project Presentation.pptx`
- ❌ `vasan 1st review.pptx`
- ❌ `vasan_1st_review.pptx[1].pptx`

### System Files (Auto-ignored by .gitignore)
- ❌ `__pycache__/` - Python cache
- ❌ `.env` - Environment variables
- ❌ `*.log` - Log files

---

## 📁 Final Repository Structure

Your GitHub repository should look like this:

```
vijay/
├── app.py                    ✅ REQUIRED
├── requirements.txt          ✅ REQUIRED
├── Procfile                  ✅ REQUIRED
├── runtime.txt               ✅ REQUIRED
├── .gitignore                ✅ REQUIRED
├── README.md                 ✅ RECOMMENDED
└── code/                     ✅ REQUIRED
    ├── index.html           ✅ REQUIRED
    ├── style.css            ✅ REQUIRED
    ├── script.js            ✅ REQUIRED
    └── images/              ✅ REQUIRED
        └── company logo.png ✅ REQUIRED
```

---

## 🚀 Quick Checklist

Before pushing to GitHub, verify:

- [ ] `app.py` is included
- [ ] `requirements.txt` is included
- [ ] `Procfile` is included
- [ ] `runtime.txt` is included
- [ ] `.gitignore` is included
- [ ] `code/` folder is included
- [ ] `code/index.html` exists
- [ ] `code/style.css` exists
- [ ] `code/script.js` exists
- [ ] `code/images/` folder exists
- [ ] `code/images/company logo.png` exists
- [ ] `data/` folder is NOT included (or is in .gitignore)
- [ ] Personal/unrelated files are NOT included

---

## 📝 Notes

1. **Data Folder**: The `data/` folder will be automatically created by Flask when the app runs on Render. Don't upload it.

2. **Images**: Make sure ALL images used in your website are in the `code/images/` folder.

3. **.gitignore**: Already configured to exclude `data/` folder and other unnecessary files.

4. **File Paths**: All paths in your code use forward slashes (`/`) which work on all platforms.

---

## ✅ Verification Steps

After uploading to GitHub:

1. Go to your repository: `https://github.com/rohith747/vijay`
2. Check that you can see:
   - `app.py` file
   - `code/` folder
   - `code/index.html` file
   - `code/images/` folder
3. Click on `code/images/` and verify `company logo.png` is there
4. If everything is there, Render will deploy successfully!



