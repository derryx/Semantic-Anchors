#!/bin/bash
# Installation script for pre-commit hooks

set -e

echo "Installing pre-commit framework..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required"
    exit 1
fi

# Install pre-commit
pip install pre-commit

# Install AsciiDoc linter
pip install git+https://github.com/doctoolchain/asciidoc-linter.git

# Install pre-commit hooks
pre-commit install

echo "✓ Pre-commit hooks installed successfully!"
echo ""
echo "Usage:"
echo "  - Hooks run automatically on 'git commit'"
echo "  - Run manually: pre-commit run --all-files"
echo "  - Update hooks: pre-commit autoupdate"
