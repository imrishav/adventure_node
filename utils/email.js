const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1.)Create RTCDtlsTransportStateChangedEvent

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    //Activate gmail "less secure app" option
  });

  // 2.) Define Email options

  const mailOptions = {
    from: 'Rishav Sinha <hello@rishav.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3.)Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
