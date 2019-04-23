const {Client} = require("pg");
const settings = require("./settings");

const name = process.argv[2]
console.log('Searching ...')

const client = new Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
})

let counter = 1

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  client.query("SELECT first_name, last_name, birthdate FROM famous_people WHERE first_name = $1::text", [name], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    console.log(`Found ${result.rows.length} person(s) by the name ${name}:`);
    printOutput (result, counter)
    client.end();
  });
});

const getBirthday = function (result, index) {
  let rawDate  = result.rows[index-1].birthdate
  let date = `19${rawDate.getYear()}-${rawDate.getMonth()+1}-${rawDate.getDate()}`
  return date
}

const printOutput = function (result, counter) {
  result.rows.forEach( function (){
    console.log(`- ${counter} ${name} ${result.rows[counter-1].last_name}, born '${getBirthday(result, counter)}'`)
    counter ++
  })
}