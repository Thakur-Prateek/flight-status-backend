// events/consumer.js

const amqp = require('amqplib/callback_api');
const { sendEmail } = require('../config/sendGridConfig');
const { sendSMS, sendWhatsApp } = require('../config/twilioConfig');
const db = require('../models');

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

        console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

        channel.consume(queue, async (msg) => {
            console.log(`[x] Received ${msg.content.toString()}`);
            const data = JSON.parse(msg.content.toString());

            try {
                const { user, flightDetails } = data;
                const notification = await db.Notification.findOne({ where: { user_id: user.id } });

                if (notification) {
                    const messageBody = `Flight ${flightDetails.flightNumber} is now ${flightDetails.status}. ` +
                                        `Departure: ${new Date(flightDetails.departureTime).toLocaleString()}. ` +
                                        `Arrival: ${new Date(flightDetails.arrivalTime).toLocaleString()}.`;

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
            } catch (error) {
                console.error('Error sending notifications:', error);
            }
        }, {
            noAck: true
        });
    });
});
