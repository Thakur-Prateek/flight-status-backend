const twilio = require('twilio');
const accountSid = 'ACf97b5803794dad845e6a8abdf6d7f606';
const authToken = 'e1824bfe47c5aabf9ccfc59c5e026789';
const client = new twilio(accountSid, authToken);

const sendSms = (to, message) => {
  console.log(`Sending SMS to ${to}`);
  client.messages.create({
    body: message,
    to: to,  // Ensure the phone number includes the country code
    from: '+19383003403'
  })
  .then((message) => console.log('SMS sent:', message.sid))
  .catch((error) => {
    console.error('Error sending SMS:', error);
    console.error(`Error Code: ${error.code}, More Info: ${error.moreInfo}`);
  });
};

const sendWhatsApp = (to, message) => {
  console.log(`Sending WhatsApp to ${to}`);
  client.messages.create({
    body: message,
    to: `whatsapp:${to}`,  // Ensure the phone number includes the country code without an extra '+'
    from: 'whatsapp:+14155238886'
  })
  .then((message) => console.log('WhatsApp sent:', message.sid))
  .catch((error) => {
    console.error('Error sending WhatsApp:', error);
    console.error(`Error Code: ${error.code}, More Info: ${error.moreInfo}`);
  });
};

module.exports = { sendSms, sendWhatsApp };
