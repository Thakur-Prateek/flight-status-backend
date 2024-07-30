const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('API KEY');

const sendEmail = (to, subject, text) => {
  const msg = {
    to,
    from: 'prateekthakur@students.sau.ac.in',
    subject,
    text
  };
  sgMail.send(msg)
    .then(() => console.log('Email sent'))
    .catch(error => console.error(`Error sending email: ${error}`));
};

module.exports = { sendEmail };
