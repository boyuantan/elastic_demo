var portNum = 3000

var express = require('express');
var app = express();

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

// var restangular = require('restangular');
var elastic = require('elasticsearch');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var client = new elastic.Client({
  host: 'localhost:9200'
});

app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/search/:q', function(req, res) {
  client.ping({
    requestTimeout: 30000
  }, function(err) {
    if (err) {
      throw err;
    } else {
      console.log("All is well!");
    }
  });
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(portNum, function() {
  console.log("Server up on port " + portNum);
});

module.exports = app;
