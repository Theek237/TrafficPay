const express = require('express');
const { confirmMockPayment, getPayment } = require('../controllers/paymentController');

const router = express.Router();

router.post('/mock-confirm', confirmMockPayment);
router.get('/:id', getPayment);

module.exports = router;
