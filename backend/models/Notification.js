const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  fineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fine',
    required: true
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  officerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipientPhone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 160
  },
  type: {
    type: String,
    required: true,
    enum: ['SMS', 'PUSH', 'EMAIL'],
    default: 'SMS'
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'SENT', 'DELIVERED', 'FAILED'],
    index: true,
    default: 'PENDING'
  },
  gateway: {
    type: String
  },
  gatewayRef: {
    type: String
  },
  retryCount: {
    type: Number,
    default: 0
  },
  sentAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema, 'notifications');
