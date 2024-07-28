'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];
const db = {};
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
  });
}

fs
  .readdirSync(path.join(__dirname, 'models'))
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Authentication endpoint with detailed logging
app.post('/authenticate', async (req, res) => {
  const { mobile_number } = req.body;
  console.log(`Authenticating user with mobile number: ${mobile_number}`);

  try {
    const user = await db.User.findOne({ where: { mobile_number } });
    console.log(`User found: ${JSON.stringify(user)}`);

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error(`Error checking user: ${err.message}`);
    console.error(err.stack);
    res.status(500).send('Error checking user');
  }
});

// Fetch flight details for authenticated user
app.get('/flights/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const flights = await db.Flight.findAll({ where: { user_id: userId } });

    if (flights.length > 0) {
      res.json({ success: true, flights });
    } else {
      res.status(404).json({ success: false, message: 'No flights found for this user' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching flight details');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = db;
