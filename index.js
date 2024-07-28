'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { sendNotificationEvent } = require('./events/producer');

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

// Fetch notification preferences
app.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const notification = await db.Notification.findOne({ where: { user_id: userId } });
    if (notification) {
      res.json({ success: true, notification });
    } else {
      res.status(404).json({ success: false, message: 'Notification settings not found' });
    }
  } catch (err) {
    console.error(`Error fetching notification settings: ${err.message}`);
    res.status(500).send('Error fetching notification settings');
  }
});

// Update notification preferences
app.post('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  const { notify_sms, notify_email, notify_whatsapp, notify_browser } = req.body;
  try {
    const notification = await db.Notification.findOne({ where: { user_id: userId } });
    if (notification) {
      notification.notify_sms = notify_sms;
      notification.notify_email = notify_email;
      notification.notify_whatsapp = notify_whatsapp;
      notification.notify_browser = notify_browser;
      await notification.save();
      res.json({ success: true, notification });
    } else {
      const newNotification = await db.Notification.create({
        user_id: userId,
        notify_sms,
        notify_email,
        notify_whatsapp,
        notify_browser
      });
      res.json({ success: true, notification: newNotification });
    }
  } catch (err) {
    console.error(`Error updating notification settings: ${err.message}`);
    res.status(500).send('Error updating notification settings');
  }
});

// Endpoint to send notifications (example usage of RabbitMQ)
app.post('/sendNotification', async (req, res) => {
  const { userId, flightDetails } = req.body;
  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch the user's notification preferences
    const notification = await db.Notification.findOne({ where: { user_id: userId } });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification settings not found' });
    }

    const notificationMessage = `Flight Details\n\nFlight Number: ${flightDetails.flightNumber}\nDeparture Time: ${flightDetails.departureTime}\nArrival Time: ${flightDetails.arrivalTime}\nStatus: ${flightDetails.status}\nGate: ${flightDetails.gate}\nTerminal: ${flightDetails.terminal}`;

    // Send the notification event to RabbitMQ
    sendNotificationEvent(JSON.stringify({ user, flightDetails, notification }));

    res.json({ success: true, message: 'Notifications sent' });
  } catch (err) {
    console.error(`Error sending notification: ${err.message}`);
    res.status(500).send('Error sending notification');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = db;
