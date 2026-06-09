const Notification = require('../models/Notification');

const sendMockSMS = async (fine, payment, phone, message) => {
  try {
    console.log(`\n======================================`);
    console.log(`[MOCK SMS SENDER] To: ${phone}`);
    console.log(`[MESSAGE]: ${message}`);
    console.log(`======================================\n`);

    const notification = await Notification.create({
      fineId: fine._id,
      paymentId: payment ? payment._id : null,
      officerId: fine.officerId,
      recipientPhone: phone,
      message,
      type: 'SMS',
      status: 'DELIVERED',
      sentAt: Date.now()
    });

    return notification;
  } catch (error) {
    console.error('Failed to log SMS notification:', error);
  }
};

module.exports = { sendMockSMS };
