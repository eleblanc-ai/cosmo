#!/bin/bash

# Cosmo initialization script
# Sets up a new React project with Vite and prepares Cosmo files

set -e

echo "🛸 Initializing Cosmo project..."
echo ""

# Create Vite project (auto-confirm existing files)
echo "📦 Creating Vite + React + TypeScript project..."
npm create vite@latest . -- --template react-ts || true

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

# Copy Cosmo files to root
echo ""
echo "📋 Copying Cosmo configuration files..."
cp cosmo/architecture.md .
cp cosmo/spec.md .

echo ""
echo "✅ Initialization complete!"
echo ""
echo "Next steps:"
echo "1. Open this project in your LLM-enabled IDE"
echo "2. Tell your AI assistant: 'Read cosmo/cosmo.md and follow those instructions'"
