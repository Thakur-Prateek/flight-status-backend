const webPush = require('web-push');

const vapidKeys = {
  publicKey: 'BNOubIkxQQa1y5fpM2MBJ7FZI69__i113K1sIiXhO2YbM737-ZlXi8KM9fHi3FgJTMDTe_xMd19MlTeyueEa6cU',
  privateKey: '7NVd7nIO5qXx3KitMRW3Ma9gj7dTTXALxbIhd8aKv-U'
};

webPush.setVapidDetails(
  'mailto:prateek.thakur6@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const sendPushNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, JSON.stringify(dataToSend))
    .then(() => console.log('Push Notification sent'))
    .catch(error => console.error(`Push Notification error: ${error}`));
};


module.exports = { sendPushNotification };
