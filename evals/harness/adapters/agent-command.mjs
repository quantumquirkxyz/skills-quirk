import { spawn } from 'node:child_process';

export function createAdapter({ command, args = [], timeoutMs = 120000 } = {}) {
  if (!command) throw new Error('agent command is required');
  return {
    name: 'agent:command',
    async run(request) {
      return await new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'], cwd: request.cwd });
        let stdout = ''; let stderr = '';
        const timer = setTimeout(() => { child.kill(); reject(new Error('agent command timed out')); }, timeoutMs);
        child.stdout.on('data', (chunk) => { stdout += chunk; }); child.stderr.on('data', (chunk) => { stderr += chunk; });
        child.once('error', reject);
        child.once('close', (code) => { clearTimeout(timer); if (code !== 0) return reject(new Error(`agent exited with ${code}: ${stderr.slice(-1000)}`)); resolve({ status: 'completed', output: stdout }); });
        child.stdin.end(JSON.stringify(request));
      });
    },
  };
}

export default { createAdapter };
