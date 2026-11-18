const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
  empName: String,
  empPass: { type: String, select: false },
  created: { type: Date, default: Date.now }
}, {
  collection: 'ftEmployees',
  bufferCommands: false
});

module.exports = mongoose.model('Employees', empSchema);