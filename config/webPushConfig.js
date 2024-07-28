const webPush = require('web-push');

// Replace these with your generated VAPID keys
const vapidKeys = {
  publicKey: 'BNOubIkxQQa1y5fpM2MBJ7FZI69__i113K1sIiXhO2YbM737-ZlXi8KM9fHi3FgJTMDTe_xMd19MlTeyueEa6cU',
  privateKey: '7NVd7nIO5qXx3KitMRW3Ma9gj7dTTXALxbIhd8aKv-U'
};

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const sendPushNotification = (subscription, message) => {
  webPush.sendNotification(subscription, message)
  .then(response => console.log('Push Notification sent:', response))
  .catch(error => console.error('Push Notification error:', error));
};

module.exports = { sendPushNotification };
