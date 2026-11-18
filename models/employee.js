const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
  empName: { type: String, required: true, trim: true, maxlength: 100 },
  empPass: { type: String, required: true, select: false },
  created: { type: Date, default: Date.now }
}, {
  collection: 'ftEmployees',
  bufferCommands: false
});

module.exports = mongoose.model('Employees', empSchema);