const mongoose = require('mongoose');

const fineCategorySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  demeritPoints: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  },
  legalRef: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FineCategory', fineCategorySchema, 'fine_categories');
