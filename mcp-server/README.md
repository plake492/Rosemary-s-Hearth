# GitHub MCP Server

A Model Context Protocol (MCP) server that provides GitHub workflow automation tools for seamless AI-assisted development.

## 🚀 Overview

This MCP server integrates with GitHub's API to provide powerful workflow automation directly through GitHub Copilot and other MCP-compatible clients. It enables you to manage GitHub repositories, create issues, handle branches, and automate common git workflows without leaving your development environment.

## 🛠️ Features

### GitHub API Integration

- **Issue Management**: Create and manage GitHub issues with labels
- **Branch Operations**: Create, switch, and manage branches
- **Pull Request Workflow**: Create PRs with rich descriptions
- **Repository Cleanup**: Automated branch cleanup after merges

### Safety & Automation

- **Merge Verification**: Safety checks before branch deletion
- **Auto-stashing**: Preserves uncommitted work automatically
- **Error Handling**: Graceful handling of edge cases
- **Detailed Logging**: Step-by-step operation reporting

## 📋 Prerequisites

- Node.js (v18 or higher)
- GitHub Personal Access Token
- Git configured locally
- Supabase project (for database schema context)

## ⚙️ Setup

### 1. Environment Configuration

Create a `.env` file in the `mcp-server` directory:

```env
# GitHub Configuration
GITHUB_PAT=your_github_personal_access_token
GITHUB_USER=your_github_username
GITHUB_REPO=your_repository_name

# Supabase Configuration (for project context)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies

```bash
cd mcp-server
npm install
```

### 3. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 🔧 VS Code Integration

### Configure MCP Client

Create or update `.vscode/mcp.json`:

```json
{
  "httpServers": {
    "github-mcp": {
      "command": "node",
      "args": ["mcp-server/server.js"],
      "type": "http",
      "url": "http://localhost:5000"
    }
  }
}
```

## 🎯 Available Tools

### 1. `create_issue`

Create GitHub issues with labels and descriptions.

**Parameters:**

- `title` (string, required): Issue title
- `description` (string, required): Issue description
- `labels` (array, optional): Array of label strings

**Example:**

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_issue",
    "arguments": {
      "title": "Fix login bug",
      "description": "Users cannot log in with special characters in password",
      "labels": ["bug", "urgent", "authentication"]
    }
  }
}
```

### 2. `create_branch`

Create a new branch from a base branch.

**Parameters:**

- `branchName` (string, required): Name of the new branch
- `fromBranch` (string, optional): Base branch (default: "main")

**Example:**

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_branch",
    "arguments": {
      "branchName": "feature/user-authentication",
      "fromBranch": "develop"
    }
  }
}
```

### 3. `checkout_branch`

Checkout an existing branch with automatic fetching and stashing.

**Parameters:**

- `branchName` (string, required): Branch name to checkout

**Example:**

```json
{
  "method": "tools/call",
  "params": {
    "name": "checkout_branch",
    "arguments": {
      "branchName": "feature/user-authentication"
    }
  }
}
```

### 4. `create_pr`

Create a pull request with rich descriptions.

**Parameters:**

- `title` (string, required): PR title
- `description` (string, optional): PR description
- `head` (string, required): Source branch
- `base` (string, optional): Target branch (default: "main")
- `draft` (boolean, optional): Create as draft (default: false)

**Example:**

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_pr",
    "arguments": {
      "title": "Add user authentication system",
      "description": "Implements secure user authentication with JWT tokens and password hashing",
      "head": "feature/user-authentication",
      "base": "main",
      "draft": false
    }
  }
}
```

### 5. `cleanup_merged_branch`

Automated cleanup of merged branches with safety checks.

**Parameters:**

- `branchName` (string, required): Branch to clean up
- `baseBranch` (string, optional): Target branch (default: "main")
- `force` (boolean, optional): Force delete unmerged branches (default: false)

**Example:**

```json
{
  "method": "tools/call",
  "params": {
    "name": "cleanup_merged_branch",
    "arguments": {
      "branchName": "feature/user-authentication",
      "baseBranch": "main",
      "force": false
    }
  }
}
```

## 🔄 Complete Workflow Example

Here's a complete GitHub workflow using the MCP server:

### 1. Create Feature Branch

```bash
curl -X POST http://localhost:5000/ -H "Content-Type: application/json" -d '{
  "method": "tools/call",
  "params": {
    "name": "create_branch",
    "arguments": {
      "branchName": "feature/new-feature"
    }
  }
}'
```

### 2. Checkout Branch Locally

```bash
curl -X POST http://localhost:5000/ -H "Content-Type: application/json" -d '{
  "method": "tools/call",
  "params": {
    "name": "checkout_branch",
    "arguments": {
      "branchName": "feature/new-feature"
    }
  }
}'
```

### 3. Develop and Commit Changes

```bash
# Make your changes...
git add .
git commit -m "Implement new feature"
git push
```

### 4. Create Pull Request

```bash
curl -X POST http://localhost:5000/ -H "Content-Type: application/json" -d '{
  "method": "tools/call",
  "params": {
    "name": "create_pr",
    "arguments": {
      "title": "Add new feature",
      "description": "Implements the requested new feature with tests and documentation",
      "head": "feature/new-feature"
    }
  }
}'
```

### 5. Clean Up After Merge

```bash
curl -X POST http://localhost:5000/ -H "Content-Type: application/json" -d '{
  "method": "tools/call",
  "params": {
    "name": "cleanup_merged_branch",
    "arguments": {
      "branchName": "feature/new-feature"
    }
  }
}'
```

## 🔒 Security Features

### Branch Protection

- **Merge Verification**: Prevents deletion of unmerged branches
- **Stash Safety**: Auto-stashes uncommitted changes before operations
- **Error Recovery**: Graceful handling of failed operations

### Authentication

- Uses GitHub Personal Access Token for secure API access
- Token should have appropriate repository permissions:
  - `repo` - Full repository access
  - `workflow` - Update GitHub Actions workflows (if needed)

## 🐛 Troubleshooting

### Common Issues

**Server Not Starting**

- Check if port 5000 is available
- Verify Node.js version (v18+)
- Check environment variables

**GitHub API Errors**

- Verify GitHub PAT has correct permissions
- Check repository name and owner in environment
- Ensure rate limits aren't exceeded

**Branch Operations Failing**

- Verify git is configured locally
- Check if repository is up to date
- Ensure working directory is clean

### Debug Mode

Set environment variable for verbose logging:

```bash
DEBUG=mcp-server npm run dev
```

## 📚 API Reference

### Health Check

```bash
GET http://localhost:5000/health
```

### MCP Protocol Endpoint

```bash
POST http://localhost:5000/
Content-Type: application/json

{
  "method": "initialize"
}
```

### Legacy Endpoints (for testing)

- `GET /test-connection` - Test database connection
- `POST /create_issue` - Direct issue creation
- `POST /create_branch` - Direct branch creation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch using the MCP server
3. Develop your changes
4. Create a PR using the MCP server
5. Clean up after merge using the automation

## 📄 License

This project is part of the Rosemary's Hearth application and follows the same licensing terms.

## 🔗 Related Documentation

- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [VS Code MCP Extension](https://marketplace.visualstudio.com/items?itemName=modelcontextprotocol.mcp)
