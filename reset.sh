#!/bin/bash

# Emma Reset Script
# Restores clean templates and clears completed slices

echo "Resetting Emma to clean state..."

# Restore template files
cp templates/spec.md spec.md
cp templates/architecture.md architecture.md

# Clear completed slices (but keep the README)
find slices -name "SLICE-*.md" -type f -delete

echo "✓ spec.md restored"
echo "✓ architecture.md restored"
echo "✓ Completed slices cleared"
echo ""
echo "Emma is ready for a fresh start!"
