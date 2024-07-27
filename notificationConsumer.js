// notificationConsumer.js
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const { firestore } = require('./config');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password'
  }
});

const consumeNotifications = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('notification_queue', { durable: false });

  channel.consume('notification_queue', async (msg) => {
    const { userId, message } = JSON.parse(msg.content.toString());
    console.log(`Received message for user ${userId}: ${message}`);

    // Fetch user preferences from Firestore
    const userDoc = await firestore.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const { preferences } = userDoc.data();
      // Send email notification
      if (preferences.email) {
        const mailOptions = {
          from: 'your_email@gmail.com',
          to: preferences.email,
          subject: 'Flight Status Update',
          text: message
        };
        await transport.sendMail(mailOptions);
      }
      // Send SMS notification (example with Twilio)
      // if (preferences.sms) {
      //   // Integrate Twilio to send SMS
      // }
      // Send other notifications as per user preferences
    }

    channel.ack(msg);
  });

  console.log('Waiting for messages in notification_queue...');
};

consumeNotifications().catch(console.error);
