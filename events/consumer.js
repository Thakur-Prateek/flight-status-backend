const amqp = require('amqplib/callback_api');
const { sendSms, sendWhatsApp } = require('../config/twilioConfig');
const { sendEmail } = require('../config/sendGridConfig');
const { sendPushNotification } = require('../config/webPushConfig');

const receiveNotificationEvent = () => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      const queue = 'notificationQueue';

      channel.assertQueue(queue, {
        durable: false
      });

      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

      channel.consume(queue, (msg) => {
        const message = JSON.parse(msg.content.toString());
        const { user, flightDetails, notification } = message;
        const notificationMessage = `Flight Details\n\nFlight Number: ${flightDetails.flightNumber}\nDeparture Time: ${flightDetails.departureTime}\nArrival Time: ${flightDetails.arrivalTime}\nStatus: ${flightDetails.status}\nGate: ${flightDetails.gate}\nTerminal: ${flightDetails.terminal}`;

        if (notification.notify_sms) {
          sendSms(user.mobile_number, notificationMessage);
        }
        if (notification.notify_whatsapp) {
          sendWhatsApp(user.mobile_number, notificationMessage);
        }
        if (notification.notify_email) {
          sendEmail(user.email, 'Flight Notification', notificationMessage);
        }
        if (notification.notify_browser && user.pushSubscription) {
          sendPushNotification(user.pushSubscription, notificationMessage);
        }
      }, {
        noAck: true
      });
    });
  });
};

receiveNotificationEvent();
