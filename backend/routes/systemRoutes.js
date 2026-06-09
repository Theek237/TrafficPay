const express = require('express');
const District = require('../models/District');
const FineCategory = require('../models/FineCategory');

const router = express.Router();

// @desc      Get all districts
// @route     GET /api/v1/districts
// @access    Public
router.get('/districts', async (req, res, next) => {
  try {
    const districts = await District.find({ isActive: true });
    res.status(200).json({ success: true, data: districts });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @desc      Get all fine categories
// @route     GET /api/v1/fine-categories
// @access    Public
router.get('/fine-categories', async (req, res, next) => {
  try {
    const categories = await FineCategory.find({ isActive: true });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
