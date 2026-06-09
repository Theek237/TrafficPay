const express = require('express');
const { issueFine, lookupFine, getFines } = require('../controllers/finesController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/lookup', lookupFine);
router.post('/', protect, authorize('OFFICER'), issueFine);
router.get('/', protect, authorize('ADMIN'), getFines);

module.exports = router;
