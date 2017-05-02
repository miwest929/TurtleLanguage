'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var exec = require('child_process').exec;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));

app.post('/audio', function (req, res) {
  fs.writeFile("recording.wav", req.body, function(err) {
    if (err) {
      console.log(err);
    } else {
      var cmd = "flac -f recording.wav";
      exec(cmd, function(error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
      });
    }
  });
});

var port = 3001;
app.listen(port, function () {
  console.log('App is listening on port ' + port + '!');
});
