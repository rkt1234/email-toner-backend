const sgMail = require('@sendgrid/mail');
const { workerData, parentPort } = require('worker_threads');

(async () => {
  try {
    const { email, name } = workerData;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: process.env.EMAIL_USER, // Must be verified in SendGrid
      subject: 'Welcome to our service!',
      // text: `Hi ${name}, thanks for signing up!`,
      text: "I hope you're doing well! I just wanted to follow up on my previous message and see if you had a chance to look at it. I understand things can get busy, so no rush — happy to connect whenever it's convenient for you"
    };

    await sgMail.send(msg);
    console.log(`✅ Welcome email sent to ${email}`);

    // Send message back to parent thread (main process)
    if (parentPort) {
      parentPort.postMessage({
        status: 'success',
        email,
        message: 'Email sent successfully',
      });
    }
  } catch (err) {
    const errorMsg = err?.response?.body || err.message;
    console.error('❌ Error sending welcome email:', errorMsg);

    if (parentPort) {
      parentPort.postMessage({
        status: 'error',
        email: workerData?.email,
        message: errorMsg,
      });
    }
  }
})();
