const Employee = require('../models/employee');

exports.getdefault = function (req, res) {
  res.send('You are on the root route.');
};

exports.aboutus = function (req, res) {
  res.send('You are on the about us route.');
};

exports.addemployee = function (req, res) {
  res.send('You are on the addemployee route');
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