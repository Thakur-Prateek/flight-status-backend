// index.js

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sendEmail } = require('./config/sendGridConfig');
const { sendSMS, sendWhatsApp } = require('./config/twilioConfig');
const { sendNotification } = require('./events/producer');
const db = require('./models');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

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
  const { notify_sms, notify_email, notify_whatsapp } = req.body;
  try {
    const notification = await db.Notification.findOne({ where: { user_id: userId } });
    if (notification) {
      notification.notify_sms = notify_sms;
      notification.notify_email = notify_email;
      notification.notify_whatsapp = notify_whatsapp;
      await notification.save();
      res.json({ success: true, notification });
    } else {
      const newNotification = await db.Notification.create({
        user_id: userId,
        notify_sms,
        notify_email,
        notify_whatsapp
      });
      res.json({ success: true, notification: newNotification });
    }
  } catch (err) {
    console.error(`Error updating notification settings: ${err.message}`);
    res.status(500).send('Error updating notification settings');
  }
});

// Endpoint to send notifications
app.post('/sendNotification', async (req, res) => {
  const { userId, flightDetails } = req.body;

  try {
    const user = await db.User.findOne({ where: { id: userId } });

    if (user) {
      const messageBody = `Flight ${flightDetails.flightNumber}. ` +
                          `Departure: ${new Date(flightDetails.departureTime).toLocaleString()}. ` +
                          `Arrival: ${new Date(flightDetails.arrivalTime).toLocaleString()}.`;

      const notification = await db.Notification.findOne({ where: { user_id: userId } });

      if (notification) {
        if (notification.notify_sms) {
          await sendSMS(user.mobile_number, messageBody);
        }
        if (notification.notify_email) {
          await sendEmail(user.email, 'Flight Status Update', messageBody);
        }
        if (notification.notify_whatsapp) {
          await sendWhatsApp(user.mobile_number, messageBody);
        }
      }

      // Send message to the notification queue
      await sendNotification({
        user,
        flightDetails
      });

      res.json({ success: true, message: 'Notifications sent' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error(`Error sending notification: ${err.message}`);
    res.status(500).send('Error sending notification');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = db;
