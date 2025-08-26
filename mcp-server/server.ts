import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import { projectContext } from './projectContext.ts';
import { getDbTables } from './supabase.ts';
dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = 5000;

// GitHub config
const GITHUB_PAT = process.env.GITHUB_PAT!;
const OWNER = process.env.GITHUB_USER!;
const REPO = process.env.GITHUB_REPO!;

async function getProjectCtx() {
  const { tableCtx, error } = await getDbTables();
  if (error) {
    throw new Error(`Error fetching DB schema: ${error.message}`);
  }
  return projectContext(tableCtx);
}

// -------------------- MCP Protocol Implementation --------------------

// Handle MCP protocol messages at root path
app.post('/', async (req, res) => {
  console.log('Received MCP request:', JSON.stringify(req.body, null, 2));

  try {
    const { method, params } = req.body;

    switch (method) {
      case 'initialize':
        const context = await getProjectCtx();
        const response = {
          capabilities: {
            tools: {
              create_issue: {
                description: 'Create a GitHub issue',
                inputSchema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    labels: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['title', 'description'],
                },
              },
              create_branch: {
                description: 'Create a new branch from main',
                inputSchema: {
                  type: 'object',
                  properties: {
                    branchName: { type: 'string' },
                    fromBranch: { type: 'string', default: 'main' },
                  },
                  required: ['branchName'],
                },
              },
              checkout_branch: {
                description: 'Checkout an existing branch (fetch and switch locally)',
                inputSchema: {
                  type: 'object',
                  properties: {
                    branchName: { type: 'string' },
                  },
                  required: ['branchName'],
                },
              },
              commit_and_push: {
                description: 'Commit changes and push to branch',
                inputSchema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    branch: { type: 'string' },
                    files: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['message', 'branch'],
                },
              },
              create_pr: {
                description: 'Create a pull request',
                inputSchema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    head: { type: 'string' },
                    base: { type: 'string', default: 'main' },
                    draft: { type: 'boolean', default: false },
                  },
                  required: ['title', 'head'],
                },
              },
            },
          },
          serverInfo: {
            name: 'github-repo-mcp-server',
            version: '1.0.0',
          },
          protocolVersion: '2024-11-05',
          context,
        };
        res.json(response);
        break;

      case 'tools/call':
        const toolName = params?.name;
        const toolParams = params?.arguments || {};

        if (toolName === 'create_issue') {
          const { title, description, labels } = toolParams;
          try {
            const response = await axios.post(
              `https://api.github.com/repos/${OWNER}/${REPO}/issues`,
              { title, body: description, labels },
              { headers: { Authorization: `Bearer ${GITHUB_PAT}` } },
            );
            res.json({
              content: [
                {
                  type: 'text',
                  text: `Issue created successfully: ${response.data.html_url}`,
                },
              ],
            });
          } catch (err: any) {
            res.status(500).json({
              error: {
                code: -32603,
                message: `Failed to create issue: ${err.message}`,
              },
            });
          }
        } else if (toolName === 'create_branch') {
          const { branchName, fromBranch = 'main' } = toolParams;
          try {
            // Get the SHA of the source branch
            const refResponse = await axios.get(
              `https://api.github.com/repos/${OWNER}/${REPO}/git/ref/heads/${fromBranch}`,
              { headers: { Authorization: `Bearer ${GITHUB_PAT}` } },
            );
            const sha = refResponse.data.object.sha;

            // Create new branch
            const response = await axios.post(
              `https://api.github.com/repos/${OWNER}/${REPO}/git/refs`,
              {
                ref: `refs/heads/${branchName}`,
                sha: sha,
              },
              { headers: { Authorization: `Bearer ${GITHUB_PAT}` } },
            );

            res.json({
              content: [
                {
                  type: 'text',
                  text: `Branch '${branchName}' created successfully from '${fromBranch}'`,
                },
              ],
            });
          } catch (err: any) {
            res.status(500).json({
              error: {
                code: -32603,
                message: `Failed to create branch: ${err.message}`,
              },
            });
          }
        } else if (toolName === 'commit_and_push') {
          const { message, branch, files = [] } = toolParams;
          try {
            // This is a simplified implementation - in practice you'd need to:
            // 1. Get current tree SHA
            // 2. Create blobs for changed files
            // 3. Create new tree
            // 4. Create commit
            // 5. Update branch reference

            res.json({
              content: [
                {
                  type: 'text',
                  text: `Note: commit_and_push requires local git operations. Use git commands in terminal for now: git add, git commit, git push`,
                },
              ],
            });
          } catch (err: any) {
            res.status(500).json({
              error: {
                code: -32603,
                message: `Failed to commit and push: ${err.message}`,
              },
            });
          }
        } else if (toolName === 'create_pr') {
          const { title, description = '', head, base = 'main', draft = false } = toolParams;
          try {
            const response = await axios.post(
              `https://api.github.com/repos/${OWNER}/${REPO}/pulls`,
              {
                title,
                body: description,
                head,
                base,
                draft,
              },
              { headers: { Authorization: `Bearer ${GITHUB_PAT}` } },
            );

            res.json({
              content: [
                {
                  type: 'text',
                  text: `Pull request created successfully: ${response.data.html_url}`,
                },
              ],
            });
          } catch (err: any) {
            res.status(500).json({
              error: {
                code: -32603,
                message: `Failed to create pull request: ${err.message}`,
              },
            });
          }
        } else if (toolName === 'checkout_branch') {
          const { branchName } = toolParams;
          try {
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);

            // Get the workspace root (go up one directory from github-mcp)
            const workspaceRoot = '/Users/patricklake/Dev/freelance/02-rosemarys-hearth/Rosemary-s-Hearth';

            // Check if there are uncommitted changes
            try {
              const { stdout } = await execAsync('git status --porcelain', { cwd: workspaceRoot });
              if (stdout.trim()) {
                // Stash all changes including untracked files
                await execAsync('git stash push -u -m "Auto-stash before branch checkout"', { cwd: workspaceRoot });
              }
            } catch (err) {
              console.log('Warning: Could not stash changes:', err);
              // Force stash everything just in case
              try {
                await execAsync('git stash -u', { cwd: workspaceRoot });
              } catch (stashErr) {
                console.log('Could not force stash:', stashErr);
              }
            }

            // Fetch latest changes
            await execAsync('git fetch origin', { cwd: workspaceRoot });

            // Check if branch exists locally
            try {
              await execAsync(`git show-ref --verify --quiet refs/heads/${branchName}`, { cwd: workspaceRoot });
              // Branch exists locally, just switch to it
              await execAsync(`git checkout ${branchName}`, { cwd: workspaceRoot });
            } catch {
              // Branch doesn't exist locally, create and track remote branch
              await execAsync(`git checkout -b ${branchName} origin/${branchName}`, { cwd: workspaceRoot });
            }

            res.json({
              content: [
                {
                  type: 'text',
                  text: `Successfully checked out branch '${branchName}'. Any uncommitted changes were stashed.`,
                },
              ],
            });
          } catch (err: any) {
            res.status(500).json({
              error: {
                code: -32603,
                message: `Failed to checkout branch: ${err.message}`,
              },
            });
          }
        } else {
          res.status(400).json({
            error: {
              code: -32601,
              message: `Unknown tool: ${toolName}`,
            },
          });
        }
        break;

      default:
        res.status(400).json({
          error: {
            code: -32601,
            message: `Unknown method: ${method}`,
          },
        });
    }
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: -32603,
        message: error.message,
      },
    });
  }
});

// -------------------- Legacy HTTP endpoints for testing --------------------
app.get('/test-connection', async (req, res) => {
  const ctx = await getProjectCtx();
  console.log('Project Context:\n', ctx);
  res.json({ success: true, ctx });
});

// Minimal MCP "initialize" - this is what your config expects
app.post('/initialize', async (req, res) => {
  try {
    const context = await getProjectCtx();
    res.json({
      capabilities: ['create_issue', 'create_branch', 'commit_and_push', 'create_pr'],
      context,
      protocolVersion: '2024-11-05',
      serverInfo: {
        name: 'github-repo-mcp-server',
        version: '1.0.0',
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Also support GET for initialize (some MCP clients expect this)
app.get('/initialize', async (req, res) => {
  try {
    const context = await getProjectCtx();
    res.json({
      capabilities: ['create_issue', 'create_branch', 'commit_and_push', 'create_pr'],
      context,
      protocolVersion: '2024-11-05',
      serverInfo: {
        name: 'github-repo-mcp-server',
        version: '1.0.0',
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create GitHub Issue
app.post('/create_issue', async (req, res) => {
  const { title, description, labels } = req.body;

  try {
    const response = await axios.post(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues`,
      { title, body: description, labels },
      { headers: { Authorization: `Bearer ${GITHUB_PAT}` } },
    );
    res.json({ success: true, issue: response.data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create Branch
app.post('/create_branch', async (req, res) => {
  const { branchName, fromBranch = 'main' } = req.body;

  try {
    // Get the SHA of the source branch
    const refResponse = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/git/ref/heads/${fromBranch}`, {
      headers: { Authorization: `Bearer ${GITHUB_PAT}` },
    });
    const sha = refResponse.data.object.sha;

    // Create new branch
    const response = await axios.post(
      `https://api.github.com/repos/${OWNER}/${REPO}/git/refs`,
      {
        ref: `refs/heads/${branchName}`,
        sha: sha,
      },
      { headers: { Authorization: `Bearer ${GITHUB_PAT}` } },
    );

    res.json({
      success: true,
      message: `Branch '${branchName}' created from '${fromBranch}'`,
      branch: response.data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create PR
app.post('/create_pr', async (req, res) => {
  const { title, description = '', head, base = 'main', draft = false } = req.body;

  try {
    const response = await axios.post(
      `https://api.github.com/repos/${OWNER}/${REPO}/pulls`,
      {
        title,
        body: description,
        head,
        base,
        draft,
      },
      { headers: { Authorization: `Bearer ${GITHUB_PAT}` } },
    );

    res.json({ success: true, pr: response.data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

let cachedSchema = 'Loading schema...';

// Expose schema context to Copilot
app.get('/schema-context', (req, res) => {
  res.json({ schema: cachedSchema });
});

app.get('/', (_, res) => res.send('GitHub MCP Server - Running'));

// Health check endpoint
app.get('/health', (_, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));

// -------------------- Example usage --------------------
async function refreshSchema() {
  try {
    const { tableCtx } = await getDbTables();
    cachedSchema = JSON.stringify(tableCtx, null, 2);
  } catch (error) {
    console.error('Error refreshing schema:', error);
  }
}

// Refresh schema periodically
setInterval(refreshSchema, 1000 * 60 * 5); // refresh every 5 min
refreshSchema();

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`GitHub MCP server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  / - Health check');
  console.log('  GET  /health - Health status');
  console.log('  GET  /initialize - MCP initialization');
  console.log('  POST /initialize - MCP initialization');
  console.log('  GET  /schema-context - Database schema');
  console.log('  POST /create_issue - Create GitHub issue');
  console.log('  POST /create_branch - Create GitHub branch');
  console.log('  POST /create_pr - Create GitHub pull request');
});
