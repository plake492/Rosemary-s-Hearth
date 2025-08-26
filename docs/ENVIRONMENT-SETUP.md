# MCP Server Environment Configuration

## Development Environment

This file contains environment variables for the MCP server.
Copy this to `.env` and customize for your setup.

```bash
# GitHub Integration
GITHUB_TOKEN=your_github_personal_access_token_here

# Supabase Integration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Webhook Security (optional but recommended)
GITHUB_WEBHOOK_SECRET=your_random_secret_string

# Git Automation Settings
AUTO_EXECUTE_GIT=false           # Set to true for full automation
SKIP_CONFIRMATIONS=false         # Set to true to skip safety prompts
DEFAULT_AUTOMATION_LEVEL=2       # 1=manual, 2=assisted, 3=semi-auto, 4=full-auto

# Server Configuration
PORT=5000                        # MCP server port
NODE_ENV=development             # development | production

# Logging
LOG_LEVEL=info                   # error | warn | info | debug
```

## Security Notes

- **Never commit `.env` files** to version control
- **Rotate tokens regularly** for production use
- **Use webhook secrets** to validate GitHub webhooks
- **Limit token permissions** to required scopes only

## GitHub Token Permissions

Your GitHub personal access token needs these permissions:
- ✅ **repo** (Full repository access)
- ✅ **workflow** (Update GitHub Action workflows)

## Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to **Settings → API**
3. Copy the **Project URL** and **anon/public key**
4. Paste them into your `.env` file

## Webhook Secret Generation

Generate a secure webhook secret:

```bash
# macOS/Linux
openssl rand -hex 20

# Or use any random string generator
```

## Production Considerations

For production deployment:

1. **Use environment variables** instead of `.env` files
2. **Set up proper monitoring** for webhook deliveries
3. **Configure rate limiting** for API endpoints
4. **Use HTTPS** for all webhook URLs
5. **Implement proper error handling** and logging

## Development Setup

1. Copy the example above to `.env`
2. Fill in your actual values
3. Start the MCP server: `npm start`
4. Test with your favorite MCP client

## Troubleshooting

### Common Issues

**GitHub API Rate Limits**:
- Increase delay between operations
- Use GitHub App tokens for higher limits

**Supabase Connection Errors**:
- Verify URL and key are correct
- Check project status in Supabase dashboard
- Ensure database is not paused

**Webhook Delivery Failures**:
- Verify webhook URL is accessible
- Check webhook secret matches
- Monitor GitHub webhook delivery logs
