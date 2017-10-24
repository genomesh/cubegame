'use strict'
var express = require('express');
var path = require('path');
var app = express();

var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname,'public')));

let highscores = [];
for (let i = 0;i<10;i++) {
    highscores[i] = [];
    for (let j = 0;j<3;j++) {
        highscores[i][j] = {
            name : "NONE",
            score : 0
        }
    }
}

let hits = 0;

app.use(bodyParser.text());
app.use(bodyParser.json());

app.listen(app.get('port'), function () {
  console.log('Running pentagon defence web service on port', app.get('port'));
});

app.post('/highscore',function (req, res) {
    let theScore=(req.body).score;
    let theLevel=(req.body).level;
    let theName=(req.body).name;
    console.log(theName,theLevel,theScore);
    if (theScore > highscores[theLevel][0].score) {
        highscores[theLevel].splice(0,0,{
            name: theName,
            score: theScore
        })
    } else if (theScore > highscores[theLevel][1].score) {
        highscores[theLevel].splice(1,0,{
            name: theName,
            score: theScore
        })
    } else if (theScore > highscores[theLevel][2].score) {
        highscores[theLevel].splice(2,0,{
            name: theName,
            score: theScore
        })
    }
    highscores[theLevel].length=3;
    res.setHeader('Content-Type', 'application/json');
    res.json(highscores);
})

app.get('/hits',function(req, res) {
    hits+=1;
    res.setHeader('Content-Type', 'application/json')
    let hitObj = {"hits":hits};
    res.json(hitObj);
})