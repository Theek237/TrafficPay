const Fine = require('../models/Fine');
const FineCategory = require('../models/FineCategory');
const { generateReferenceNo } = require('../utils/referenceGenerator');

// @desc      Issue new traffic fine
// @route     POST /api/v1/fines
// @access    Private (OFFICER)
exports.issueFine = async (req, res, next) => {
  try {
    const { vehicleNo, categoryId, districtId, location, notes, driverName, driverLicense } = req.body;

    const category = await FineCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Fine category not found' });
    }

    const referenceNo = await generateReferenceNo();

    // dueDate = issuedAt + 30 days
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const fine = await Fine.create({
      referenceNo,
      vehicleNo,
      officerId: req.user.id,
      categoryId,
      districtId,
      amount: category.amount,
      location,
      notes,
      driverName,
      driverLicense,
      dueDate
    });

    res.status(201).json({
      success: true,
      data: fine
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      Lookup public fine for payment
// @route     GET /api/v1/fines/lookup
// @access    Public
exports.lookupFine = async (req, res, next) => {
  try {
    const { referenceNo, categoryCode } = req.query;

    if (!referenceNo || !categoryCode) {
      return res.status(400).json({ success: false, message: 'Please provide referenceNo and categoryCode' });
    }

    const category = await FineCategory.findOne({ code: categoryCode });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category code is invalid' });
    }

    const fine = await Fine.findOne({ referenceNo, categoryId: category._id })
      .populate('categoryId', 'code name amount')
      .populate('districtId', 'name province');

    if (!fine) {
      return res.status(404).json({ success: false, message: 'Fine not found with given details' });
    }

    res.status(200).json({
      success: true,
      data: fine
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      Get fines (paginated)
// @route     GET /api/v1/fines
// @access    Private (ADMIN)
exports.getFines = async (req, res, next) => {
  try {
    const fines = await Fine.find()
      .populate('categoryId', 'code name')
      .populate('districtId', 'name province')
      .populate('officerId', 'fullName badgeNo')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: fines.length,
      data: fines
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      Update a fine
// @route     PUT /api/v1/fines/:id
// @access    Private (ADMIN)
exports.updateFine = async (req, res, next) => {
  try {
    let fine = await Fine.findById(req.params.id);
    if (!fine) {
      return res.status(404).json({ success: false, message: 'Fine not found' });
    }

    fine = await Fine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('categoryId', 'code name')
      .populate('districtId', 'name province')
      .populate('officerId', 'fullName badgeNo');

    res.status(200).json({ success: true, data: fine });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      Delete a fine
// @route     DELETE /api/v1/fines/:id
// @access    Private (ADMIN)
exports.deleteFine = async (req, res, next) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) {
      return res.status(404).json({ success: false, message: 'Fine not found' });
    }

    await fine.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
