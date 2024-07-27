// config.js
const admin = require('firebase-admin');
const { Client } = require('pg');
const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // Download this file from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-database-name.firebaseio.com"
});

const firestore = admin.firestore();

const client = new Client({
  user: 'your_postgres_user',
  host: 'localhost',
  database: 'your_postgres_db',
  password: 'your_postgres_password',
  port: 5432,
});

client.connect();

module.exports = { firestore, client };
