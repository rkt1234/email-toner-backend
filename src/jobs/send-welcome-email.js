// src/jobs/send-welcome-email.js
const { workerData, parentPort } = require('worker_threads');
const { sendWelcomeEmail } = require('../services/emailService');

(async () => {
  try {
    await sendWelcomeEmail(workerData);

    if (parentPort) {
      parentPort.postMessage({
        status: 'success',
        email: workerData.email,
        message: 'Welcome email sent',
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
