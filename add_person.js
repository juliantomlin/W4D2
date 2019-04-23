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
const last = process.argv[3]
const rawDate = process.argv[4]

const date = new Date(rawDate.substring(0,4), rawDate.substring(5,7)-1, rawDate.substring(8,10))

pg
  .insert([
    {first_name: name,
    last_name: last,
    birthdate: date}
    ])
  .into('famous_people')
  .asCallback(function (err){
    if (err){
      console.log(err)
    }
    pg.destroy()
  })

