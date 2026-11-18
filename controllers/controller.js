const Employee = require('../models/employee');
const bcrypt = require('bcryptjs');

exports.getdefault = function (req, res) {
  res.send('You are on the root route.');
};

exports.aboutus = function (req, res) {
  res.send('You are on the about us route.');
};

exports.addemployee = async function (req, res) {
  const { empName, empPass } = req.body || {};
  if (typeof empName !== 'string' || !empName.trim() || empName.trim().length > 100 ||
      typeof empPass !== 'string' || empPass.length < 8 || Buffer.byteLength(empPass, 'utf8') > 72) {
    return res.status(400).json({
      error: 'Provide empName (1–100 characters) and empPass (at least 8 characters, at most 72 UTF-8 bytes).'
    });
  }

  try {
    const employee = await Employee.create({
      empName: empName.trim(),
      empPass: await bcrypt.hash(empPass, 12)
    });
    res.status(201).json({ message: 'Created ' + employee.empName });
  } catch (error) {
    if (Employee.db.readyState !== 1) {
      return res.status(503).json({ error: 'Employee database is unavailable.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid employee data.' });
    }
    res.status(500).json({ error: 'Unable to create employee.' });
  }
};

exports.getemployees = async function (req, res) {
  try {
    const employeeData = await Employee.find({}, { empPass: 0 })
      .maxTimeMS(3000)
      .lean()
      .exec();
    res.json(employeeData);
  } catch (error) {
    if (Employee.db.readyState !== 1) {
      return res.status(503).json({ error: 'Employee database is unavailable.' });
    }
    res.status(500).json({ error: 'Unable to retrieve employees.' });
  }
};