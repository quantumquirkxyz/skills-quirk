import { spawn } from 'node:child_process';

export function createAdapter({ command, args = [], timeoutMs = 30000 } = {}) {
  if (!command) throw new Error('MCP command is required');
  return {
    name: 'mcp:stdio',
    async callTool({ name, arguments: input = {} }) {
      const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
      const request = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: input } });
      return await new Promise((resolve, reject) => {
        const timer = setTimeout(() => { child.kill(); reject(new Error('MCP tool call timed out')); }, timeoutMs);
        let output = '';
        child.stdout.on('data', (chunk) => { output += chunk; });
        child.once('error', reject);
        child.once('close', (code) => { clearTimeout(timer); if (code !== 0) return reject(new Error(`MCP process exited with ${code}`)); try { resolve(JSON.parse(output.trim())); } catch { reject(new Error('MCP returned invalid JSON')); } });
        child.stdin.end(`${request}\n`);
      });
    },
  };
}

export default { createAdapter };
