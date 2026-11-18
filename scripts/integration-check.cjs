const assert = require('node:assert/strict');
const { once } = require('node:events');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../index');

(async () => {
  let server;
  let name;
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employees_mcp_bootcamp', { serverSelectionTimeoutMS: 3000 });
    if (mongoose.connection.name !== 'employees_mcp_bootcamp') throw new Error('Integration check is restricted to employees_mcp_bootcamp.');
    name = `Day3Integration-${process.pid}-${Date.now()}`;
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const url = `http://127.0.0.1:${server.address().port}`;
    const response = await fetch(url + '/addemployee', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empName: name, empPass: 'integration-dummy-only' })
    });
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { message: 'Created ' + name });
    const stored = await mongoose.connection.collection('ftEmployees').findOne({ empName: name });
    assert.ok(stored);
    assert.ok(await bcrypt.compare('integration-dummy-only', stored.empPass));
    const listResponse = await fetch(url + '/getemployees');
    assert.equal(listResponse.status, 200);
    const list = await listResponse.json();
    assert.ok(list.some(employee => employee.empName === name));
    assert.ok(list.every(employee => !Object.hasOwn(employee, 'empPass')));
    console.log('PASS real MongoDB create/list round trip, hashed persistence, and password exclusion.');
  } finally {
    if (name && mongoose.connection.readyState === 1) await mongoose.connection.collection('ftEmployees').deleteOne({ empName: name });
    if (server) await new Promise(resolve => server.close(resolve));
    await mongoose.disconnect();
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });