const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('flight_status', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
