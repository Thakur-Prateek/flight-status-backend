const amqp = require('amqplib/callback_api');

function sendNotification(notificationData) {
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
      throw err;
    }
    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }
      const queue = 'notificationQueue';

      channel.assertQueue(queue, {
        durable: false
      });

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(notificationData)));
      console.log(`[x] Sent ${JSON.stringify(notificationData)}`);
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  });
}

module.exports = { sendNotification };
