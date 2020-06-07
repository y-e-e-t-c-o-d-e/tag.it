const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require("cors");

const errorHandler = require('./shared/error').errorHandler;
const indexRouter = require('./routes/index');

// Middleware to parse JSON data
app.use(bodyParser.json());

app.use(cors());

// don't cache requests
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
})

app.use('/', indexRouter);

// Error Handling
app.use(errorHandler);

const port = process.env.PORT || 4000;
const server = app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = server;