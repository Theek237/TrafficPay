const express = require('express');
const { getSummary, getByDistrict } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/summary', getSummary);
router.get('/by-district', getByDistrict);

module.exports = router;
