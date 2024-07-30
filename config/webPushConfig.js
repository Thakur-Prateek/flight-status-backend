const webPush = require('web-push');

const vapidKeys = {
  publicKey: 'public',
  privateKey: 'private'
};

webPush.setVapidDetails(
  'mailto:your-email-id',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const sendPushNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, JSON.stringify(dataToSend))
    .then(() => console.log('Push Notification sent'))
    .catch(error => console.error(`Push Notification error: ${error}`));
};


module.exports = { sendPushNotification };
