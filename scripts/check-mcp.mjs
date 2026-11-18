import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';

const runner = fileURLToPath(new URL('./run-mcp.cjs', import.meta.url));
for (const kind of ['mongodb', 'docker', 'git']) {
  const client = new Client({ name: 'day3-mcp-check', version: '1.0.0' });
  const transport = new StdioClientTransport({ command: process.execPath, args: [runner, kind], stderr: 'pipe' });
  try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    assert.ok(tools.length > 0);
    console.log(`PASS ${kind}: initialize and tools/list (${tools.length} tools)`);
    const tool = tools.find(t => t.name === ({ mongodb: 'list-collections', docker: 'list_containers', git: 'git_status' })[kind]);
    if (tool) {
      const args = kind === 'mongodb' ? { connectionId: 'preconfigured', database: 'employees_mcp_bootcamp' } : kind === 'git' ? { repo_path: fileURLToPath(new URL('..', import.meta.url)) } : {};
      const result = await client.callTool({ name: tool.name, arguments: args });
      assert.ok(!result.isError, `${kind} read-only tool call failed`);
      console.log(`PASS ${kind}: ${tool.name} (read-only result not logged)`);
    }
  } finally {
    await client.close();
  }
}
console.log('GitHub/Postman use browser OAuth; a configured URL alone is not a verified MCP session.');