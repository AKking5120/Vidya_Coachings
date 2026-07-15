# ============================================
# Run this script AFTER installing Git
# Right-click → "Run with PowerShell"
# OR paste commands one by one in Terminal
# ============================================

# STEP 1: Configure Git (change name & email)
git config --global user.email "vidyacoachings1@gmail.com"
git config --global user.name "Vidya Coachings"

# STEP 2: Initialize repo
git init

# STEP 3: Stage all files (including public/ photos)
git add .

# STEP 4: First commit
git commit -m "Initial commit - Vidya Coachings website with all photos"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Git setup done!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "NOW DO THIS:" -ForegroundColor Yellow
Write-Host "1. Go to github.com and create a new repository named 'vidya-coachings'"
Write-Host "2. Copy the repository URL"
Write-Host "3. Run these commands (replace URL with yours):"
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/vidya-coachings.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Then go to vercel.com and import the repository"
