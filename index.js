require('dotenv').config({ path: require('node:path').join(__dirname, '.env'), quiet: true });
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const router = express.Router();
const port = Number(process.env.PORT || 8000);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
routes(router);
app.use('/', router);

if (require.main === module) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employees_mcp_bootcamp';
  mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(() => console.error('MongoDB connection failed; check MONGODB_URI and the MongoDB service.'));

  app.listen(port, function () {
    console.log('Listening... ' + port);
  });
}

module.exports = app;