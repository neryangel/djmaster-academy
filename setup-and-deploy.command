#!/bin/bash
# Double-click this file on Mac to run it!
# Or run: bash setup-and-deploy.command

cd "$(dirname "$0")"
echo "📂 Working in: $(pwd)"
echo ""

# Verify we're in the right place
if [ ! -f "package.json" ]; then
  echo "❌ package.json not found. Wrong directory!"
  exit 1
fi

echo "✅ Found DJMaster Academy project"
echo ""

# === GITHUB ===
echo "📦 GITHUB SETUP"
echo "==============="

# Install gh if needed
if ! command -v gh &>/dev/null; then
  echo "Installing GitHub CLI..."
  if command -v brew &>/dev/null; then
    brew install gh
  else
    echo "❌ Please install GitHub CLI first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "   brew install gh"
    read -p "Press Enter after installing..."
  fi
fi

# Login to GitHub
if ! gh auth status &>/dev/null 2>&1; then
  echo "🔑 Please log in to GitHub:"
  gh auth login
fi

# Create repo and push
if git remote get-url origin &>/dev/null 2>&1; then
  echo "✅ Remote exists, pushing..."
  git push -u origin main
else
  echo "🆕 Creating repo on GitHub..."
  gh repo create djmaster-academy --public \
    --description "🎧 DJMaster Academy — Hebrew DJ Learning Platform" \
    --source=. --push
fi

echo ""
echo "✅ GitHub done! $(git remote get-url origin 2>/dev/null)"
echo ""

# === VERCEL ===
echo "🚀 VERCEL SETUP"
echo "==============="

if ! command -v vercel &>/dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

if ! vercel whoami &>/dev/null 2>&1; then
  echo "🔑 Please log in to Vercel:"
  vercel login
fi

echo "🚀 Deploying..."
vercel --yes

echo ""
echo "============================================"
echo "🎉 DONE! Your DJ Academy is live!"
echo "============================================"
echo ""
echo "Run 'vercel --prod' for production deploy"
echo ""
read -p "Press Enter to close..."
