const express = require('express');
const routes = require('./routes/routes');
const router = express.Router();
const port = Number(process.env.PORT || 8000);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
routes(router);
app.use('/', router);

if (require.main === module) {
  app.listen(port, function () {
    console.log('Listening... ' + port);
  });
}

module.exports = app;