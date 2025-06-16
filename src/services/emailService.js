// src/services/emailService.js
const sgMail = require('@sendgrid/mail');
const path = require('path');
const bree = require('../utils/bree');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send welcome email directly via SendGrid (used by worker thread)
 */
const sendWelcomeEmail = async ({ email, name }) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_USER, // must be verified sender in SendGrid
    subject: 'Welcome to EmailToner!',
    text: `Hi ${name},\n\nThanks for signing up! You're now ready to use EmailToner.`,
    html: `<h3>Hi ${name},</h3><p>Thanks for signing up! You're now ready to use <strong>EmailToner</strong>.</p>`,
  };

  await sgMail.send(msg);
  console.log(`✅ Welcome email sent to ${email}`);
};

/**
 * Triggers Bree to run the welcome email job in background
 */
const triggerWelcomeEmailJob = ({ email, name }) => {
  const jobName = `send-welcome-email-${Date.now()}`;

  bree.add({
    name: jobName,
    path: path.join(__dirname, '../jobs/send-welcome-email.js'),
    worker: {
      workerData: { email, name },
    },
  }).then(() => bree.start(jobName))
    .catch(err => console.error(`❌ Failed to start email job:`, err));
};

const sendOtpVerificationEmail = async ({ email, otp }) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Verify your Email - EmailToner',
    text: `Your EmailToner verification code is: ${otp}`,
    html: `
      <p>Your <strong>EmailToner</strong> verification code is:</p>
      <h2>${otp}</h2>
      <p>This code is valid for 10 minutes.</p>
    `,
  };

  await sgMail.send(msg);
  console.log(`✅ OTP email sent to ${email}`);
};

module.exports = {
  sendWelcomeEmail,
  triggerWelcomeEmailJob,
  sendOtpVerificationEmail
};
