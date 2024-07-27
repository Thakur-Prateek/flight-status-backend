// index.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { firestore, client, connectRabbitMQ } = require('./config');
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to Flight Status Backend!');
});

// Endpoint to fetch flight details from PostgreSQL
app.get('/flight-details/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const query = 'SELECT * FROM flights WHERE user_id = $1';
    const values = [userId];
    const result = await client.query(query, values);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'No flight details found for this user.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching flight details' });
  }
});

// Endpoint to update user preferences in Firestore
app.post('/update-preferences', async (req, res) => {
  const { userId, preferences } = req.body;
  try {
    await firestore.collection('users').doc(userId).set({ preferences }, { merge: true });
    res.json({ message: 'Preferences updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating preferences' });
  }
});

// Endpoint to get user preferences from Firestore
app.get('/preferences/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const doc = await firestore.collection('users').doc(userId).get();
    if (doc.exists) {
      res.json(doc.data());
    } else {
      res.status(404).json({ message: 'No preferences found for this user.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching preferences' });
  }
});

// Send notification
const sendNotification = async (channel, queue, message) => {
  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(message));
  console.log(`Sent message to ${queue}: ${message}`);
};

// Example usage of sendNotification
const notifyUser = async (userId, message) => {
  try {
    const channel = await connectRabbitMQ();
    await sendNotification(channel, 'notification_queue', JSON.stringify({ userId, message }));
  } catch (err) {
    console.error('Error sending notification:', err);
  }
};

// Example: Send notification when flight status changes
app.post('/flight-status-update', async (req, res) => {
  const { userId, flightStatus } = req.body;
  try {
    // Update flight status in PostgreSQL
    const query = 'UPDATE flights SET status = $1 WHERE user_id = $2';
    const values = [flightStatus, userId];
    await client.query(query, values);

    // Notify user
    const message = `Your flight status has been updated to ${flightStatus}`;
    await notifyUser(userId, message);

    res.json({ message: 'Flight status updated and notification sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating flight status' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
