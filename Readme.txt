🚀 Deploy to Render.com — Step by Step
Step 1: Create a GitHub Repository
Go to https://github.com/new
Name it: flores-y-arte (or any name you like)
Keep it Public (or Private — Render works with both)
Click Create repository
On your computer, open a terminal in your project folder and run:
bash

Copy
git init
git add .
git commit -m "Initial commit - Flores & Arte floristry website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/flores-y-arte.git
git push -u origin main



Step 2: Deploy on Render
Go to https://render.com → Sign up (free, can use GitHub login)
Click New + → Web Service
Connect your GitHub account
Select the flores-y-arte repository
Render will auto-detect the settings from render.yaml:
Name: flores-y-arte
Runtime: Node
Build Command: npm install
Start Command: node server.js
Click Create Web Service
Wait 2-3 minutes for the first deploy

Step 4: Access Your Site
Main site: https://flores-y-arte.onrender.com
Admin panel: https://flores-y-arte.onrender.com/admin.html
Admin Login
Usuario: admin
Contraseña: flores2026