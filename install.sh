#!/bin/bash

# Token Report CLI - Installation Script
# Installs both the CLI tool and Claude Code skill

set -e

REPO_URL="https://github.com/hellovigoss/cc-burn-report.git"
INSTALL_DIR="$HOME/.claude/tools/token-report"
SKILL_DIR="$HOME/.claude/skills"

echo "🚀 Token Report CLI Installer"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be >= 18 (current: $(node -v))"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"
echo "✅ Git $(git --version | cut -d' ' -f3)"
echo ""

# Install CLI tool
echo "🔧 Installing CLI tool..."

if [ -d "$INSTALL_DIR" ]; then
    echo "⚠️  Installation directory already exists: $INSTALL_DIR"
    read -p "   Remove and reinstall? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$INSTALL_DIR"
    else
        echo "   Skipping CLI installation"
        SKIP_CLI=true
    fi
fi

if [ "$SKIP_CLI" != "true" ]; then
    mkdir -p "$(dirname "$INSTALL_DIR")"
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    npm link
    echo "✅ CLI tool installed to: $INSTALL_DIR"
else
    cd "$INSTALL_DIR"
    git pull origin main
    npm link
    echo "✅ CLI tool updated"
fi

echo ""

# Install skill
echo "📚 Installing Claude Code skill..."

mkdir -p "$SKILL_DIR"

if [ -f "$SKILL_DIR/token-report.md" ]; then
    echo "⚠️  Skill file already exists: $SKILL_DIR/token-report.md"
    read -p "   Overwrite? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp "$INSTALL_DIR/skills/token-report.md" "$SKILL_DIR/"
        echo "✅ Skill updated"
    else
        echo "   Skipping skill installation"
    fi
else
    cp "$INSTALL_DIR/skills/token-report.md" "$SKILL_DIR/"
    echo "✅ Skill installed to: $SKILL_DIR/token-report.md"
fi

echo ""

# Configuration setup
echo "⚙️  Configuration setup"

if [ -f "$HOME/.token-report.json" ] || [ -f ".token-report.json" ]; then
    echo "✅ Configuration file already exists"
else
    echo "📝 No configuration file found. Would you like to create one now?"
    read -p "   Create configuration? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        read -p "CTok Email: " email
        read -sp "CTok Password: " password
        echo ""

        cat > "$HOME/.token-report.json" << EOF
{
  "baseUrl": "https://subus.imds.ai",
  "email": "$email",
  "password": "$password",
  "timezone": "Asia/Shanghai"
}
EOF
        echo "✅ Configuration saved to: $HOME/.token-report.json"
    else
        echo "⚠️  You can create configuration later:"
        echo "   cp $INSTALL_DIR/token-report-example.json ~/.token-report.json"
    fi
fi

echo ""
echo "✨ Installation complete!"
echo ""
echo "📖 Usage:"
echo "   token-report --days 7"
echo "   token-report --start 2026-02-01 --end 2026-02-27"
echo "   token-report --help"
echo ""
echo "🔗 Documentation: $INSTALL_DIR/README.md"
