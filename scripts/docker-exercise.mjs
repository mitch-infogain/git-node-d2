import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const context = path.resolve(process.argv[2] || root);
const client = new Client({ name: 'day3-docker-exercise', version: '1.0.0' });
try {
  await client.connect(new StdioClientTransport({
    command: process.execPath,
    args: [fileURLToPath(new URL('./run-mcp.cjs', import.meta.url)), 'docker'],
    stderr: 'pipe'
  }));
  async function call(name, args) {
    const result = await client.callTool({ name, arguments: args }, undefined, { timeout: 600000 });
    assert.ok(!result.isError, `${name} failed: ${JSON.stringify(result.content)}`);
    for (const item of result.content || []) {
      if (item.type !== 'text') continue;
      try {
        const data = JSON.parse(item.text);
        assert.ok(!data.error, `${name} failed: ${data.error}`);
      } catch (error) { if (error.code === 'ERR_ASSERTION') throw error; }
    }
    console.log(`PASS Docker MCP ${name}`);
    return result;
  }
  await call('pull_image', { repository: 'nginx', tag: 'alpine' });
  const listing = await call('list_containers', { all: true });
  if (!JSON.stringify(listing).includes('mcp-test-nginx')) {
    await call('run_container', {
      image: 'nginx:alpine', name: 'mcp-test-nginx', detach: true,
      ports: { '80/tcp': ['127.0.0.1', 8080] }, labels: { bootcamp: 'day3' }
    });
  }
  await call('build_image', { path: context, tag: 'my-node-app:day3' });
} finally { await client.close(); }