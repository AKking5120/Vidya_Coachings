# Deployment Guide — Vidya Coachings

## After Git is installed, run these commands in order:

### 1. Open Command Prompt in project folder
Right-click on vidya-coachings-next folder → "Open in Terminal"

### 2. Initialize Git
```
git init
git config user.email "your@email.com"
git config user.name "Your Name"
```

### 3. Add all files
```
git add .
git commit -m "Initial commit - Vidya Coachings website"
```

### 4. Push to GitHub (replace URL with your repo URL)
```
git remote add origin https://github.com/YOUR_USERNAME/vidya-coachings.git
git branch -M main
git push -u origin main
```

### 5. Deploy on Vercel
1. Go to vercel.com → Sign up with GitHub
2. Click "New Project"
3. Import your vidya-coachings repository
4. Add Environment Variables (Settings → Environment Variables):
   - NEXT_PUBLIC_SUPABASE_URL = your supabase url
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = your anon key
   - SUPABASE_SERVICE_ROLE_KEY = your service role key
   - NEXT_PUBLIC_ADMIN_PASSWORD = vidya@admin2025
   - NEXT_PUBLIC_GAS_REVIEWS_URL = https://script.google.com/macros/s/AKfycbwmWQ5d_Jyr-WT1eQAEFtXoHBX6AFDrnUGjuBpC21xJrMxlMhpyhC2U4gmhLUQ8nW1jDQ/exec
5. Click "Deploy"

### 6. Future updates — when you add new photos via Admin Panel:
Photos go to Supabase Storage automatically.
For code changes, run:
```
git add .
git commit -m "describe your change"
git push
```
Vercel will auto-deploy.
