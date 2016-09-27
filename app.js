
var express = require('express');
var path = require('path');

var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function () {
  console.log('Running calculator web service on port', app.get('port'));
});

