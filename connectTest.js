const { Client } = require('pg')

const client = new Client({
  connectionString: 'postgres://vidcrhaaiunhxj:bd4a1113af6f63752a510e92b411c0ca9470a8bdd3c8b0470f693a792165355d@ec2-54-235-88-58.compute-1.amazonaws.com:5432/d4t3892f1qnivf',
  ssl: true
})

let fromDB = [];

client.connect();
console.log('connected');

client.query('SELECT * FROM highscores;', (err, res) => {
  if (err) throw err;
  console.log(res.rows.length);
  fromDB = [];
  for (let row of res.rows) {
    fromDB[fromDB.length] = row;
  }
  console.log(createArray(fromDB));
  client.end();
  console.log('disconnected');
});

function createArray (i) {
    var highscores = i.reduce((acc, cur) => {
        if (acc[cur.level] == undefined) {
            acc[cur.level] = [];
        }
        acc[cur.level][cur.id] = {
            name:cur.name,
            score:cur.score
        };
        
        return acc;
    }, []);
    return highscores;
}