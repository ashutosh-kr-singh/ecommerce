# GitHub Push Guide - Step by Step

## Step 1: Install Git

1. **Download Git** from: https://git-scm.com/download/win
2. **Run the installer** and follow the default settings
3. **Verify installation** - Open PowerShell and run:
   ```powershell
   git --version
   ```
   You should see something like: `git version 2.43.0.windows.1`

---

## Step 2: Configure Git (First Time Only)

Open PowerShell and set your name and email:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Example:**
```powershell
git config --global user.name "John Doe"
git config --global user.email "john@example.com"
```

Verify the config:
```powershell
git config --global --list
```

---

## Step 3: Initialize Git Repository Locally

Navigate to your project folder:

```powershell
cd "C:\Users\ck2018\OneDrive\Desktop\E-commerce"
```

Initialize a git repository:

```powershell
git init
```

This creates a hidden `.git` folder that tracks your changes.

---

## Step 4: Add Files to Staging

Add all files to git:

```powershell
git add .
```

Check what's staged (optional):
```powershell
git status
```

You should see green text showing files ready to be committed, and nothing in red (`.gitignore` prevents node_modules and .env).

---

## Step 5: Create Your First Commit

```powershell
git commit -m "Initial commit: E-commerce project setup"
```

**Good commit messages:**
- `"Initial commit: E-commerce project setup"`
- `"Add authentication and payment features"`
- `"Fix checkout bug in cart validation"`

**Bad commit messages:**
- `"update"`
- `"fix stuff"`
- `"asdf"`

---

## Step 6: Create a GitHub Repository

1. **Go to GitHub:** https://github.com/new
2. **Sign in** (create account if you don't have one)
3. **Fill in the form:**
   - **Repository name:** `ecommerce` (or any name you want)
   - **Description:** "Full-stack e-commerce application with React frontend and Node.js backend"
   - **Public or Private:** Choose based on your preference
   - **DO NOT initialize with README, .gitignore, or license** (we already have these locally)
4. **Click "Create repository"**

---

## Step 7: Connect Your Local Repo to GitHub

After creating the repo on GitHub, you'll see instructions. Run these commands in PowerShell:

```powershell
# Set the default branch to main (if not already)
git branch -M main

# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/ecommerce.git

# Push your code to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username.

**Example:**
```powershell
git branch -M main
git remote add origin https://github.com/johndoe/ecommerce.git
git push -u origin main
```

You might be asked to enter your GitHub credentials:
- **Username:** Your GitHub username
- **Password:** Your GitHub personal access token (see note below)

---

## Note: GitHub Password (Personal Access Token)

GitHub no longer accepts plain passwords. You need a Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `GitHub Desktop Token`
4. Select scope: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again)
7. Use this token as your password when pushing

---

## Step 8: Verify Your Push

1. Go to your GitHub repository URL: `https://github.com/YOUR_USERNAME/ecommerce`
2. You should see all your files there!

---

## Future Commits (After First Push)

Once set up, making changes is simple:

```powershell
# 1. Make changes to your files

# 2. Check what changed
git status

# 3. Stage your changes
git add .
# OR stage specific files:
# git add frontend/src/App.jsx

# 4. Commit with a message
git commit -m "Fixed cart calculation bug"

# 5. Push to GitHub
git push
```

---

## Common Git Commands

| Command | What it does |
|---------|-------------|
| `git status` | See what files are modified or new |
| `git add .` | Stage all changes for commit |
| `git commit -m "message"` | Save changes with a description |
| `git push` | Upload commits to GitHub |
| `git pull` | Download changes from GitHub |
| `git log` | See commit history |
| `git branch` | List branches |
| `git checkout -b feature-name` | Create and switch to a new branch |

---

## Workflow Summary

```
Make Changes → git add . → git commit -m "message" → git push
```

---

## Quick Reference: Commands in Order

```powershell
# First time setup
git init
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Add and commit files
git add .
git commit -m "Initial commit: E-commerce project setup"

# Connect to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecommerce.git
git push -u origin main

# Future pushes (just use this)
git add .
git commit -m "Your message"
git push
```

---

## Troubleshooting

**Problem:** `git: command not found`
- **Solution:** Install Git from https://git-scm.com/download/win

**Problem:** `fatal: not a git repository`
- **Solution:** Run `git init` in your project folder

**Problem:** `Permission denied` or authentication fails
- **Solution:** Use a Personal Access Token instead of password

**Problem:** `branch 'main' set up to track 'origin/main'` then nothing happens
- **Solution:** You're already set up! Just use `git push` next time

