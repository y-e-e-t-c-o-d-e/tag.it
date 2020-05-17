const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const errorHandler = require('./shared/error').errorHandler;
const indexRouter = require('./routes/index');

// Middleware to parse JSON data
app.use(bodyParser.json());
console.log(process.env.NODE_ENV);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://[\s\S]*tagdotit.netlify.app/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', indexRouter);

// Error Handling
app.use(errorHandler);

const port = process.env.PORT || 4000;
const server = app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = server;