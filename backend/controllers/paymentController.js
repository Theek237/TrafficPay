const mongoose = require('mongoose');
const Fine = require('../models/Fine');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { sendMockSMS } = require('../utils/smsService');

// @desc      Mock Payment Confirmation
// @route     POST /api/v1/payments/mock-confirm
// @access    Public
exports.confirmMockPayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fineId, payerName, payerPhone, payerEmail, paymentMethod, cardNumber } = req.body;

    const fine = await Fine.findById(fineId).populate('categoryId');
    if (!fine) {
      throw new Error('Fine not found');
    }

    if (fine.status === 'PAID') {
      throw new Error('Fine is already paid');
    }

    const receiptNo = `RCP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    const paidAt = new Date();

    const payment = new Payment({
      fineId,
      receiptNo,
      payerName,
      payerPhone,
      payerEmail,
      amount: fine.amount,
      paymentMethod,
      cardNumber: cardNumber ? cardNumber.slice(-4) : undefined,
      status: 'SUCCESS',
      paidAt
    });

    await payment.save({ session });

    fine.status = 'PAID';
    fine.paidAt = paidAt;
    await fine.save({ session });

    await session.commitTransaction();

    // Send SMS (outside transaction)
    const officer = await User.findById(fine.officerId);
    if (officer && officer.phone) {
      const msg = `Fine ${fine.referenceNo} for vehicle ${fine.vehicleNo} has been PAID (LKR ${fine.amount}). Receipt: ${receiptNo}. Driver may collect license. - SL Traffic Fine System`;
      await sendMockSMS(fine, payment, officer.phone, msg);
    } else if (fine.officerId) {
       const msg = `Fine ${fine.referenceNo} for vehicle ${fine.vehicleNo} has been PAID (LKR ${fine.amount}). Receipt: ${receiptNo}. Driver may collect license. - SL Traffic Fine System`;
      // Send to system dummy if no officer phone
      await sendMockSMS(fine, payment, '+94700000000', msg);
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        receiptNo,
        status: 'SUCCESS',
        amount: fine.amount,
        smsSent: true
      }
    });

  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

// @desc      Get receipt by Payment ID
// @route     GET /api/v1/payments/:id
// @access    Public
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path: 'fineId',
      populate: [{ path: 'categoryId' }, { path: 'districtId' }]
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
