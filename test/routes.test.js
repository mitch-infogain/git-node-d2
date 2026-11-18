const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { once } = require('node:events');
const app = require('../index');
const Employee = require('../models/employee');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
});

test('GET / uses the root controller', async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'You are on the root route.');
});

test('GET /aboutus uses the about-us controller', async () => {
  const response = await fetch(`${baseUrl}/aboutus`);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'You are on the about us route.');
});

test('POST /addemployee uses the placeholder controller', async () => {
  for (const [contentType, body] of [
    ['application/json', JSON.stringify({ empName: 'Demo', empPass: 'dummy-only' })],
    ['application/x-www-form-urlencoded', 'empName=Demo&empPass=dummy-only']
  ]) {
    const response = await fetch(`${baseUrl}/addemployee`, {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body
    });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'You are on the addemployee route');
  }
});

test('GET /addemployee is not a POST route', async () => {
  const response = await fetch(`${baseUrl}/addemployee`);
  assert.equal(response.status, 404);
});

test('GET /getemployees returns a list and requests password exclusion', async t => {
  const find = Employee.find;
  t.after(() => { Employee.find = find; });
  Employee.find = (filter, projection) => {
    assert.deepEqual(filter, {});
    assert.deepEqual(projection, { empPass: 0 });
    return {
      maxTimeMS(value) { assert.equal(value, 3000); return this; },
      lean() { return this; },
      async exec() { return [{ empName: 'Demo' }]; }
    };
  };
  const response = await fetch(`${baseUrl}/getemployees`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [{ empName: 'Demo' }]);
});

test('GET /getemployees returns an empty array when no employees exist', async t => {
  const find = Employee.find;
  t.after(() => { Employee.find = find; });
  Employee.find = () => ({
    maxTimeMS() { return this; },
    lean() { return this; },
    async exec() { return []; }
  });
  const response = await fetch(`${baseUrl}/getemployees`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), []);
});

test('GET /getemployees reports an unavailable database without leaking details', async () => {
  const response = await fetch(`${baseUrl}/getemployees`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'Employee database is unavailable.' });
});