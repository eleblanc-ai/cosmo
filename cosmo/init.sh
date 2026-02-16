#!/bin/bash

# Cosmo initialization script
# Sets up a new React project with Vite and prepares Cosmo files

set -e

echo "🛸 Initializing Cosmo project..."
echo ""

# Prompt for project name
read -p "Enter project name: " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
  echo "Error: Project name cannot be empty"
  exit 1
fi

# Prompt for repository visibility
echo ""
echo "Repository visibility:"
echo "1) Public"
echo "2) Private"
read -p "Choose (1 or 2): " REPO_VISIBILITY
case $REPO_VISIBILITY in
  1) VISIBILITY_FLAG="--public" ;;
  2) VISIBILITY_FLAG="--private" ;;
  *) echo "Invalid choice, defaulting to private"; VISIBILITY_FLAG="--private" ;;
esac

# Copy Cosmo README to preserve it before Vite overwrites
echo ""
echo "📄 Moving README.md to COSMO-README.md..."
mv README.md COSMO-README.md

# Create Vite project (auto-confirm existing files)
echo "📦 Creating Vite + React + TypeScript project..."
npm create vite@latest . -- --template react-ts || true

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

# Install testing dependencies
echo ""
echo "🧪 Installing Vitest and testing tools..."
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom

# Add verify script to package.json
echo ""
echo "⚙️  Setting up verify script..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.verify = 'npm run type-check && npm run lint && npm run test';
pkg.scripts['type-check'] = 'tsc --noEmit';
pkg.scripts.test = 'vitest run';
pkg.scripts['test:watch'] = 'vitest';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Create basic vitest config
echo ""
echo "📝 Creating Vitest configuration..."
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
EOF

# Copy Cosmo files to root
echo ""
echo "📋 Copying Cosmo configuration files..."
cp cosmo/architecture.md .
# Note: spec.md stays in cosmo/ folder - the LLM will write to cosmo/spec.md

# Initialize git repository
echo ""
echo "🔧 Initializing git repository..."
git init
git add .
git commit -m "Initial Cosmo project setup"

# Create GitHub repository
echo ""
echo "📦 Creating GitHub repository..."
if command -v gh &> /dev/null; then
  gh repo create "$PROJECT_NAME" $VISIBILITY_FLAG --source=. --remote=origin --push || {
    echo "⚠️  Warning: Failed to create GitHub repository or push initial commit"
    echo "   You can create it manually later with: gh repo create $PROJECT_NAME $VISIBILITY_FLAG"
  }
else
  echo "⚠️  Warning: GitHub CLI (gh) not found. Skipping repository creation."
  echo "   Install it with: brew install gh (macOS) or see https://cli.github.com"
  echo "   Then run: gh repo create $PROJECT_NAME $VISIBILITY_FLAG"
fi

echo ""
echo "✅ Initialization complete!"
echo ""
echo "Setup includes:"
echo "- Vite + React + TypeScript"
echo "- Vitest testing framework"
echo "- 'npm run verify' script (type-check + lint + test)"
echo "- Git repository with initial commit"
echo "- GitHub repository (if gh CLI is installed)"
echo ""
echo "Next steps:"
echo "1. Open this project in your LLM-enabled IDE"
echo "2. Tell your AI assistant: 'Read cosmo/cosmo.md and follow those instructions'"
echo ""
echo "Note: The first slice should create an example test to verify the test setup works."
