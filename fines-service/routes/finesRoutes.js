const express = require('express');
const { issueFine, lookupFine, getFines, updateFine, deleteFine } = require('../controllers/finesController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/lookup', lookupFine);
router.post('/', protect, authorize('OFFICER', 'ADMIN'), issueFine);
router.get('/', protect, authorize('ADMIN'), getFines);
router.put('/:id', protect, authorize('ADMIN'), updateFine);
router.delete('/:id', protect, authorize('ADMIN'), deleteFine);

module.exports = router;
