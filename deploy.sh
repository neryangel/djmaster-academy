#!/bin/bash
# 🎧 DJMaster Academy — GitHub + Vercel Deployment Script
# Run this from the djmaster-academy folder on your Mac

set -e

echo "🎧 DJMaster Academy — Deployment"
echo "================================="
echo ""

# Check we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "astro.config.mjs" ]; then
  echo "❌ Error: Run this script from the djmaster-academy folder!"
  echo "   Usage: cd path/to/djmaster-academy && bash deploy.sh"
  exit 1
fi

# Check git is initialized
if [ ! -d ".git" ]; then
  echo "⚠️  No git repo found. Initializing..."
  git init -b main
  git add -A
  git commit -m "🎧 DJMaster Academy — Full Project v1.0"
fi

echo ""
echo "📦 Step 1: GitHub Repository"
echo "----------------------------"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI (gh) not found."
  echo "   Install: brew install gh"
  echo "   Then re-run this script."
  exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null 2>&1; then
  echo "🔑 Logging into GitHub..."
  gh auth login
fi

# Check if remote already exists
if git remote get-url origin &> /dev/null 2>&1; then
  echo "✅ Remote 'origin' already exists: $(git remote get-url origin)"
  echo "   Pushing updates..."
  git push -u origin main
else
  echo "🆕 Creating GitHub repository..."
  gh repo create djmaster-academy \
    --public \
    --description "🎧 DJMaster Academy — Professional DJ Learning Platform (Hebrew RTL)" \
    --source=. \
    --push
fi

REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")
echo ""
echo "✅ GitHub: $REPO_URL"

echo ""
echo "🚀 Step 2: Vercel Deployment"
echo "----------------------------"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "📦 Installing Vercel CLI..."
  npm install -g vercel
fi

# Check if logged in
echo "🔑 Checking Vercel login..."
if ! vercel whoami &> /dev/null 2>&1; then
  echo "   Logging into Vercel..."
  vercel login
fi

# Deploy
echo "🚀 Deploying to Vercel..."
vercel --yes

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Visit your Vercel dashboard to set up a custom domain"
echo "   2. Connect the GitHub repo in Vercel for auto-deployments"
echo "   3. Run 'vercel --prod' when ready for production"
