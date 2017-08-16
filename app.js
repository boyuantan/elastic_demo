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

app.use('/scripts', express.static(__dirname + '/scripts'));

app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/search/:q', function(req, res) {
  client.search({
    index: 'demo',
    body: {
      query: {
        multi_match: {
          query: req.params.q,
          fields: [ 'title', 'author' ]
        }
        // match: {
        //   title: req.params.q
        // }
      }
    }
  }, function(err, data) {
    if (err) {
      throw err
    } else {
      res.send(data);
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
