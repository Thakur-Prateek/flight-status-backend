// index.js
const express = require('express');
const bodyParser = require('body-parser');
const { firestore, client } = require('./config');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
