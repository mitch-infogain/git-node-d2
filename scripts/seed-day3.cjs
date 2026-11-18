const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '../.env'), quiet: true });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employees_mcp_bootcamp', { serverSelectionTimeoutMS: 3000 });
    if (mongoose.connection.name !== 'employees_mcp_bootcamp') throw new Error('Seed is restricted to employees_mcp_bootcamp.');
    const employees = mongoose.connection.collection('ftEmployees');
    for (const empName of ['Joe', 'Mary', 'Bob']) {
      const empPass = await bcrypt.hash(empName === 'Bob' ? 'bob-demo-only' : 'bootcamp-demo-only', 12);
      await employees.updateOne({ empName, bootcamp: 'day3' }, {
        $setOnInsert: { empName, created: new Date(), bootcamp: 'day3' },
        $set: { empPass }
      }, { upsert: true });
    }
    await employees.updateMany({ bootcamp: 'day3', timestamp: { $exists: false } }, { $currentDate: { timestamp: true } });
    const bob = await employees.findOne({ empName: 'Bob', bootcamp: 'day3' }, { projection: { _id: 1 } });
    await mongoose.connection.collection('employee_weights').updateOne({ employeeId: bob._id, bootcamp: 'day3' }, {
      $setOnInsert: { employeeId: bob._id, weight: 75, uploaded: new Date(Date.now() - 30 * 86400000), bootcamp: 'day3' }
    }, { upsert: true });
    console.log('Prepared three labeled dummy employees, timestamps, and a linked fictional weight; passwords are hashed.');
  } finally { await mongoose.disconnect(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });