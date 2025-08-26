#!/bin/bash

# 🔗 GitHub Webhook Configuration Script
# This script helps set up GitHub webhooks for automated branch cleanup

set -e

echo "🔗 GitHub Webhook Setup for Auto-Cleanup"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_dependencies() {
    echo -e "${BLUE}📋 Checking dependencies...${NC}"
    
    commands=("curl" "jq")
    missing=()
    
    for cmd in "${commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            missing+=("$cmd")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required tools: ${missing[*]}${NC}"
        echo "Please install them and run this script again."
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies found${NC}"
}

# Get repository information
get_repo_info() {
    echo -e "${BLUE}📁 Repository Information${NC}"
    
    # Try to get repo info from git remote
    if git remote -v &> /dev/null; then
        REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ $REMOTE_URL =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
            REPO_OWNER="${BASH_REMATCH[1]}"
            REPO_NAME="${BASH_REMATCH[2]}"
            echo -e "${GREEN}📍 Detected repository: ${REPO_OWNER}/${REPO_NAME}${NC}"
        else
            echo -e "${YELLOW}⚠️  Could not detect GitHub repository from git remote${NC}"
            read -p "Enter repository owner: " REPO_OWNER
            read -p "Enter repository name: " REPO_NAME
        fi
    else
        echo -e "${YELLOW}⚠️  Not in a git repository${NC}"
        read -p "Enter repository owner: " REPO_OWNER
        read -p "Enter repository name: " REPO_NAME
    fi
}

# Setup local tunnel
setup_tunnel() {
    echo -e "${BLUE}🚇 Setting up local tunnel${NC}"
    
    # Check if ngrok is available
    if command -v ngrok &> /dev/null; then
        echo -e "${GREEN}📦 ngrok found${NC}"
        echo -e "${YELLOW}🔄 Starting ngrok tunnel on port 5000...${NC}"
        echo "Run this command in a separate terminal:"
        echo -e "${BLUE}ngrok http 5000${NC}"
        echo ""
        read -p "Press Enter after ngrok is running and copy the HTTPS URL here: " NGROK_URL
        WEBHOOK_URL="${NGROK_URL}/webhook/github"
    elif command -v lt &> /dev/null; then
        echo -e "${GREEN}📦 localtunnel found${NC}"
        echo -e "${YELLOW}🔄 Starting localtunnel on port 5000...${NC}"
        echo "Run this command in a separate terminal:"
        echo -e "${BLUE}lt --port 5000${NC}"
        echo ""
        read -p "Press Enter after localtunnel is running and copy the URL here: " LT_URL
        WEBHOOK_URL="${LT_URL}/webhook/github"
    else
        echo -e "${RED}❌ No tunnel tool found (ngrok or localtunnel)${NC}"
        echo "Please install one of them:"
        echo "  brew install ngrok"
        echo "  npm install -g localtunnel"
        echo ""
        read -p "Or enter your webhook URL manually: " WEBHOOK_URL
    fi
    
    echo -e "${GREEN}🔗 Webhook URL: ${WEBHOOK_URL}${NC}"
}

# Generate webhook secret
generate_secret() {
    echo -e "${BLUE}🔐 Generating webhook secret${NC}"
    
    WEBHOOK_SECRET=$(openssl rand -hex 20)
    echo -e "${GREEN}🔑 Generated secret: ${WEBHOOK_SECRET}${NC}"
    echo -e "${YELLOW}💾 Save this secret for your MCP server environment:${NC}"
    echo "GITHUB_WEBHOOK_SECRET=${WEBHOOK_SECRET}"
    echo ""
}

# Create webhook via GitHub API
create_webhook() {
    echo -e "${BLUE}🎯 Creating GitHub webhook${NC}"
    
    read -p "Enter your GitHub personal access token: " -s GITHUB_TOKEN
    echo ""
    
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${RED}❌ GitHub token is required${NC}"
        return 1
    fi
    
    # Webhook payload
    WEBHOOK_DATA=$(jq -n \
        --arg url "$WEBHOOK_URL" \
        --arg secret "$WEBHOOK_SECRET" \
        '{
            "name": "web",
            "active": true,
            "events": ["pull_request"],
            "config": {
                "url": $url,
                "content_type": "json",
                "secret": $secret,
                "insecure_ssl": "0"
            }
        }')
    
    echo -e "${YELLOW}🔄 Creating webhook...${NC}"
    
    RESPONSE=$(curl -s -w "\n%{http_code}" \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -X POST \
        -d "$WEBHOOK_DATA" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/hooks")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "201" ]; then
        WEBHOOK_ID=$(echo "$RESPONSE_BODY" | jq -r '.id')
        echo -e "${GREEN}✅ Webhook created successfully!${NC}"
        echo -e "${GREEN}🆔 Webhook ID: ${WEBHOOK_ID}${NC}"
        echo -e "${GREEN}🔗 Webhook URL: ${WEBHOOK_URL}${NC}"
    else
        echo -e "${RED}❌ Failed to create webhook (HTTP $HTTP_CODE)${NC}"
        echo "$RESPONSE_BODY" | jq -r '.message // .'
        return 1
    fi
}

# Provide manual setup instructions
manual_setup() {
    echo -e "${BLUE}📋 Manual Setup Instructions${NC}"
    echo "================================"
    echo ""
    echo "If automated setup failed, configure the webhook manually:"
    echo ""
    echo "1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/settings/hooks"
    echo "2. Click 'Add webhook'"
    echo "3. Configure:"
    echo "   Payload URL: $WEBHOOK_URL"
    echo "   Content type: application/json"
    echo "   Secret: $WEBHOOK_SECRET"
    echo "   Events: Pull requests only"
    echo "4. Click 'Add webhook'"
    echo ""
    echo -e "${GREEN}🎯 Your webhook will be ready to receive events!${NC}"
}

# Test webhook setup
test_webhook() {
    echo -e "${BLUE}🧪 Testing webhook setup${NC}"
    
    echo "To test your webhook:"
    echo "1. Make sure your MCP server is running"
    echo "2. Make sure your tunnel is active"
    echo "3. Create a test PR and merge it"
    echo "4. Check your server logs for auto-cleanup messages"
    echo ""
    echo -e "${GREEN}🎉 If you see cleanup messages, the webhook is working!${NC}"
}

# Main execution
main() {
    echo ""
    check_dependencies
    echo ""
    get_repo_info
    echo ""
    setup_tunnel
    echo ""
    generate_secret
    echo ""
    
    read -p "Do you want to create the webhook automatically? (y/n): " AUTO_CREATE
    
    if [[ $AUTO_CREATE =~ ^[Yy]$ ]]; then
        create_webhook
        if [ $? -eq 0 ]; then
            echo ""
            test_webhook
        else
            echo ""
            manual_setup
        fi
    else
        manual_setup
    fi
    
    echo ""
    echo -e "${GREEN}✨ Webhook setup completed!${NC}"
}

# Show usage if no arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "GitHub Webhook Setup Script"
    echo ""
    echo "This script helps you set up GitHub webhooks for automated branch cleanup."
    echo ""
    echo "Usage:"
    echo "  $0                  # Interactive setup"
    echo "  $0 --help          # Show this help"
    echo ""
    echo "Requirements:"
    echo "  - GitHub personal access token with repo permissions"
    echo "  - ngrok or localtunnel for local development"
    echo "  - MCP server running on localhost:5000"
    echo ""
    exit 0
fi

# Run main function
main
