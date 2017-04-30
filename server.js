'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));

app.post('/audio', function (req, res) {
  console.log("RECIEVED AUDIO TO EXTRACT INDICATORS: ", req.body);
  //<do stuff with audio and send result back>
});

var port = 3001;
app.listen(port, function () {
  console.log('App is listening on port ' + port + '!');
});
