const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
require('dotenv').config();
const envs = require('./env.js').default;

app.get('/env.js', function (req, res) {
  res.set('Content-Type', 'application/javascript');
  res.send(envs);
});

app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`App started on Port ${port}`);
});
