# 🔗 GitHub Webhook Auto-Cleanup

## Overview

This document describes how to set up GitHub webhooks to automatically trigger branch cleanup when pull requests are merged, eliminating the need for manual cleanup operations.

## 🎯 What This Solves

- **Manual Cleanup**: No more manually running cleanup commands after merging PRs
- **Forgotten Branches**: Automatic deletion of merged branches
- **Workflow Efficiency**: Seamless transition from merge to clean workspace
- **Team Consistency**: Everyone gets automatic cleanup without remembering commands

## 🏗️ Architecture

```
GitHub PR Merge → GitHub Webhook → Your MCP Server → Auto Cleanup
```

1. **PR Gets Merged** on GitHub
2. **GitHub sends webhook** to your MCP server endpoint
3. **MCP server receives webhook** and validates the event
4. **Auto-cleanup executes**:
   - Switch to main branch
   - Pull latest changes
   - Delete local merged branch
   - Delete remote branch (if needed)

## 🔧 Setup Instructions

### Step 1: MCP Server Webhook Endpoint

Your MCP server needs a webhook endpoint at `/webhook/github` that:

- Receives GitHub webhook events
- Validates webhook signatures (recommended)
- Triggers cleanup for merged PRs

### Step 2: GitHub Webhook Configuration

1. Go to your repository on GitHub
2. Navigate to **Settings → Webhooks → Add webhook**
3. Configure the webhook:
   ```
   Payload URL: https://your-domain.com/webhook/github
   Content type: application/json
   Secret: your-webhook-secret
   Events: Pull requests only
   ```

### Step 3: Environment Variables

Add to your MCP server environment:

```bash
# Optional but recommended for security
GITHUB_WEBHOOK_SECRET=your_random_secret_string

# Automation settings
AUTO_EXECUTE_GIT=true
SKIP_CONFIRMATIONS=true
```

### Step 4: Local Development Setup

For local development, you'll need to expose your localhost:

**Option A: ngrok (Recommended)**

```bash
# Install ngrok
brew install ngrok

# Expose your local server
ngrok http 5000

# Use the HTTPS URL in GitHub webhook settings
```

**Option B: localtunnel**

```bash
# Install and run
npm install -g localtunnel
lt --port 5000
```

## 🧪 Testing the Webhook

1. **Start your MCP server** (ensure webhook endpoint is active)
2. **Start your tunnel** (ngrok/localtunnel)
3. **Create a test PR** with a simple change
4. **Merge the PR** on GitHub
5. **Check your server logs** for auto-cleanup messages

### Expected Workflow:

1. ✅ Webhook received: `pull_request` with `action: closed` and `merged: true`
2. ✅ Auto-cleanup triggered for branch: `feature-branch-name`
3. ✅ Switched to main and pulled latest changes
4. ✅ Deleted local branch 'feature-branch-name'
5. ✅ Cleanup completed successfully

## 🔍 Debugging

### GitHub Webhook Deliveries

- Go to **Settings → Webhooks → Recent Deliveries**
- Check response codes and payloads
- Look for failed deliveries

### MCP Server Logs

Monitor your server output for:

```
🔄 PR #123 merged: feature-branch → main
✅ Auto-cleanup completed for feature-branch:
  • Switched to main and pulled latest changes
  • Deleted local branch 'feature-branch'
  • Remote branch 'origin/feature-branch' already deleted
```

### Common Issues

- **404 responses**: Check your tunnel URL and webhook endpoint
- **401 responses**: Verify webhook secret matches
- **Cleanup failures**: Check git repository state and permissions

## 🔐 Security Considerations

### Webhook Secret Validation

Always validate webhook signatures to ensure requests come from GitHub:

```javascript
const expectedSignature =
  'sha256=' + crypto.createHmac('sha256', webhookSecret).update(JSON.stringify(req.body)).digest('hex');
```

### Network Security

- Use HTTPS for webhook URLs
- Consider IP whitelisting for GitHub webhook IPs
- Monitor webhook deliveries for suspicious activity

## 🚀 Advanced Features

### Custom Cleanup Logic

Extend the webhook handler to:

- Send notifications to team chat
- Update project management tools
- Trigger additional CI/CD processes
- Archive branch artifacts

### Multi-Repository Support

Configure webhooks for multiple repositories:

- Use different webhook endpoints per repo
- Route based on repository name
- Maintain separate cleanup configurations

## 📊 Benefits

### Time Savings

- **Before**: 3-5 manual commands per PR merge
- **After**: Zero manual intervention

### Consistency

- **Before**: Inconsistent cleanup across team members
- **After**: Standardized cleanup for everyone

### Error Reduction

- **Before**: Forgotten cleanups lead to cluttered branches
- **After**: Automatic cleanup prevents accumulation

## 🎯 Integration with Existing Workflows

This webhook system works seamlessly with:

- ✅ **Automated Git Workflows** (`auto_git_workflow` tool)
- ✅ **Manual PR creation and merging**
- ✅ **GitHub CLI workflows**
- ✅ **Third-party Git tools**

The auto-cleanup webhook is the final piece of a fully automated git workflow:

1. **Create feature** → `auto_git_workflow` tool
2. **Review and merge** → GitHub web interface
3. **Auto cleanup** → GitHub webhook ✨

## 📝 Maintenance

### Regular Checks

- Monitor webhook delivery success rates
- Verify cleanup operations complete successfully
- Update webhook secrets periodically
- Test with different PR scenarios

### Backup Plans

If webhooks fail, manual cleanup is still available:

```bash
# Via MCP tool
./mcp-server/git-auto.sh cleanup branch-name

# Via curl
curl -X POST http://localhost:5000 \
  -d '{"method": "tools/call", "params": {"name": "cleanup_merged_branch", "arguments": {"branchName": "branch-name"}}}'
```

---

**Result**: Fully automated git workflow from feature creation to cleanup! 🎉
