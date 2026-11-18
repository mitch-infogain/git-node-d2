const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const root = path.join(__dirname, '..');

test('native MCP configuration registers five credential-free server definitions', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, '.mcp.json'), 'utf8'));
  assert.deepEqual(Object.keys(config.mcpServers).sort(), ['docker', 'git', 'github', 'mongodb', 'postman']);
  for (const name of ['github', 'postman']) {
    assert.equal(config.mcpServers[name].type, 'http');
    assert.ok(!config.mcpServers[name].headers);
  }
});

test('Postman collection covers all four application routes', () => {
  const collection = JSON.parse(fs.readFileSync(path.join(root, 'postman/day3.postman_collection.json'), 'utf8'));
  assert.deepEqual(collection.item.map(item => `${item.request.method} ${item.request.url}`).sort(), [
    'GET {{baseUrl}}/', 'GET {{baseUrl}}/aboutus', 'GET {{baseUrl}}/getemployees', 'POST {{baseUrl}}/addemployee'
  ]);
});