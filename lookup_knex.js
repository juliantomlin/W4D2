const settings = require("./settings");
var pg = require('knex')({
  client: 'pg',
  connection: {
    host : settings.hostname,
    user : settings.user,
    password : settings.password,
    database : settings.database
  }
});

const name = process.argv[2]
console.log('Searching ...')

let counter = 1

pg
  .from('famous_people')
  .select('first_name', 'last_name', 'birthdate')
  .where('first_name', name)
  .timeout(1000)
  .asCallback(function(err, rows) {
    if (err) return console.error(err);
    // console.log(rows)
    printOutput (rows, counter)
    pg.destroy()
  })

const getBirthday = function (rows, index) {
  let rawDate  = rows[index-1].birthdate
  console.log(rawDate)
  let date = `${rawDate.getFullYear()}-${rawDate.getMonth()+1}-${rawDate.getDate()}`
  return date
}

const printOutput = function (rows, counter) {
  console.log(`Found ${rows.length} person(s) by the name ${name}:`);
  rows.forEach( function (){
    console.log(`- ${counter} ${name} ${rows[counter-1].last_name}, born '${getBirthday(rows, counter)}'`)
    counter ++
  })
}