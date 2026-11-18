const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn, execFileSync } = require('node:child_process');
const root = path.join(__dirname, '..');
require('dotenv').config({ path: path.join(root, '.env'), quiet: true });

const kind = process.argv[2];
let command;
let args;
if (kind === 'mongodb') {
  const candidates = [process.execPath, path.join(os.homedir(), '.nvm/versions/node/v22.14.0/bin/node')];
  command = candidates.find(candidate => {
    try {
      const [major, minor] = execFileSync(candidate, ['-p', 'process.versions.node'], { encoding: 'utf8' }).trim().split('.').map(Number);
      return major >= 24 || (major === 22 && minor >= 13) || (major === 20 && minor >= 19);
    } catch { return false; }
  });
  if (!command) throw new Error('MongoDB MCP requires Node 20.19+, 22.13+, or 24+. Run nvm use first.');
  args = [path.join(root, 'node_modules/mongodb-mcp-server/dist/esm/index.js')];
  process.env.MDB_MCP_CONNECTION_STRING ||= 'mongodb://127.0.0.1:27017/employees_mcp_bootcamp';
  process.env.MDB_MCP_READ_ONLY ||= 'true';
  process.env.MDB_MCP_TELEMETRY ||= 'disabled';
} else if (kind === 'git' || kind === 'docker') {
  const bin = 'mcp-server-' + kind;
  const candidates = [
    process.env.MCP_BIN_DIR && path.join(process.env.MCP_BIN_DIR, bin),
    path.join(os.homedir(), '.local/bin', bin),
    process.env.XDG_DATA_HOME && path.resolve(process.env.XDG_DATA_HOME, '../bin', bin)
  ].filter(Boolean);
  command = candidates.find(candidate => fs.existsSync(candidate)) || bin;
  args = kind === 'git' ? ['--repository', root] : [];
  if (kind === 'docker') process.env.DOCKER_HOST ||= 'unix:///var/run/docker.sock';
} else {
  throw new Error('Usage: node scripts/run-mcp.cjs mongodb|docker|git');
}

const child = spawn(command, args, { cwd: root, env: process.env, stdio: 'inherit' });
child.on('error', () => { console.error(`Unable to launch ${kind} MCP. Check runtime installation.`); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));