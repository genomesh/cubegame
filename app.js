'use strict'
var express = require('express');
var path = require('path');
var app = express();

var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname,'public')));

const { Client } = require('pg')

const client = new Client({
  connectionString: 'postgres://vidcrhaaiunhxj:bd4a1113af6f63752a510e92b411c0ca9470a8bdd3c8b0470f693a792165355d@ec2-54-235-88-58.compute-1.amazonaws.com:5432/d4t3892f1qnivf',
  ssl: true
})

let fromDB = [];
let highscores = [];

client.connect();
console.log('connected');

client.query('SELECT * FROM highscores;', (err, res) => {
  if (err) throw err;
  console.log(res.rows.length);
  fromDB = [];
  for (let row of res.rows) {
    fromDB[fromDB.length] = row;
  }
  highscores = createArray(fromDB);
});

function createArray (i) {
    return i.reduce((acc, cur) => {
        if (acc[cur.level] == undefined) {
            acc[cur.level] = [];
        }
        acc[cur.level][cur.id] = {
            name:cur.name,
            score:cur.score
        };
        
        return acc;
    }, []);
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
    if (theScore > highscores[theLevel][2].score) {
        client.query("UPDATE highscores SET name = '" + highscores[theLevel][0].name + "', score = " + highscores[theLevel][0].score + " WHERE id = 0 AND level = "+theLevel+
                     ";UPDATE highscores SET name = '" + highscores[theLevel][1].name + "', score = " + highscores[theLevel][1].score + " WHERE id = 1 AND level = "+theLevel+
                     ";UPDATE highscores SET name = '" + highscores[theLevel][2].name + "', score = " + highscores[theLevel][2].score + " WHERE id = 2 AND level = "+theLevel+";",
                     (err) => {
            if (err) throw err;
        })
    }
    res.setHeader('Content-Type', 'application/json');
    res.json(highscores);
})

app.get('/hits',function(req, res) {
    hits+=1;
    res.setHeader('Content-Type', 'application/json')
    let hitObj = {"hits":hits};
    res.json(hitObj);
})