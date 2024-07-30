const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

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