const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  fineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fine',
    required: true,
    unique: true
  },
  receiptNo: {
    type: String,
    unique: true,
    sparse: true
  },
  payerName: {
    type: String,
    required: true
  },
  payerPhone: {
    type: String,
    required: true
  },
  payerEmail: {
    type: String
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'LKR'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['CARD', 'ONLINE_BANKING', 'MOBILE_WALLET']
  },
  cardNumber: {
    type: String // Last 4 digits
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    index: true,
    default: 'PENDING'
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema, 'payments');
