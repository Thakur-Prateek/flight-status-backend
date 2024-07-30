const accountSid = 'SID';
const authToken = 'authToken';
const client = require('twilio')(accountSid, authToken);

const twilioPhoneNumber = '+19383003403';
const twilioWhatsAppNumber = 'whatsapp:+14155238886';

const sendSMS = (to, body) => {
    return client.messages.create({
        body,
        from: twilioPhoneNumber,
        to
    });
};

const sendWhatsApp = (to, body) => {
    return client.messages.create({
        body,
        from: twilioWhatsAppNumber,
        to: `whatsapp:${to}`
    });
};

module.exports = { sendSMS, sendWhatsApp };
