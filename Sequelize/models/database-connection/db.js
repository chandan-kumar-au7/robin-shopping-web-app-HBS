const Sequelize = require("sequelize");
// const dotenv = require('dotenv');
// dotenv.config();
// const { POSTGRES_URI, POSTGRES_PASSWORD } = process.env;

var pg = require('pg');

var conString = "	postgres://nuzlatgn:S6xgn_3p5Pw3YyaLHOHnL_M2OOYZqfQh@topsy.db.elephantsql.com:5432/nuzlatgn" //Can be found in the Details page
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log('WIth pg connection stabalized SUCCESSFULLY')
    console.log(result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
    // client.end();
  });
});
// const sequelize = new Sequelize('postgres://postgres:9308@localhost:5432/my_project_data')

sequelize.sync();

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

module.exports = sequelize;
