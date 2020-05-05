const express = require('express');
const app = express();

const indexRouter = require('./routes/index');

app.use('/', indexRouter);

const port = process.env.PORT || 4000;
const server = app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = server;