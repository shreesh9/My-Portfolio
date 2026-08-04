@echo off
echo ============================================================
echo   SHREESH NALAWADE PORTFOLIO - GITHUB & VERCEL PUSH FIX
echo ============================================================
echo.

echo 1. Untracking large MP4 files from Git cache...
git rm --cached "assets/gst/GST dept.mp4" 2>nul
git rm --cached "assets/gst/gst dept  .mp4" 2>nul
git rm --cached *.mp4 2>nul

echo.
echo 2. Staging updated files and .gitignore...
git add .gitignore index.html main.js styles.css

echo.
echo 3. Creating clean commit...
git commit -m "Fix button modal engine, minimal surname glow & optimize for Vercel deployment"

echo.
echo 4. Pushing to GitHub (https://github.com/shreesh9/My-Portfolio.git)...
git push -u origin main

echo.
echo ============================================================
echo   DONE! Your repo is updated and ready for Vercel deployment!
echo ============================================================
pause
