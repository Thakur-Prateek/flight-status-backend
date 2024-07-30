const accountSid = 'ACf97b5803794dad845e6a8abdf6d7f606';
const authToken = 'e1824bfe47c5aabf9ccfc59c5e026789';
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
