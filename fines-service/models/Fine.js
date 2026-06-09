const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  referenceNo: {
    type: String,
    required: true,
    unique: true
  },
  vehicleNo: {
    type: String,
    required: true,
    index: true,
    uppercase: true,
    trim: true
  },
  officerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FineCategory',
    required: true
  },
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
    index: true,
    default: 'PENDING'
  },
  location: {
    address: {
      type: String
    }
  },
  notes: {
    type: String,
    maxlength: 500
  },
  driverName: {
    type: String
  },
  driverLicense: {
    type: String,
    index: true
  },
  issuedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fine', fineSchema, 'fines');
