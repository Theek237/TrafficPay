const Fine = require('../models/Fine');
const Payment = require('../models/Payment');

// @desc      Get national KPIs
// @route     GET /api/v1/analytics/summary
// @access    Private (ADMIN)
exports.getSummary = async (req, res, next) => {
  try {
    const totalIssued = await Fine.countDocuments();
    
    const paidFines = await Fine.aggregate([
      { $match: { status: 'PAID' } },
      { $group: { _id: null, totalRevenue: { $sum: { $toDouble: '$amount' } }, count: { $sum: 1 } } }
    ]);

    const revenue = paidFines.length > 0 ? paidFines[0].totalRevenue : 0;
    const paidCount = paidFines.length > 0 ? paidFines[0].count : 0;
    const collectionRate = totalIssued === 0 ? 0 : ((paidCount / totalIssued) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        totalFinesIssued: totalIssued,
        totalRevenueLKR: revenue,
        collectionRate: parseFloat(collectionRate)
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      Get district-wise revenue
// @route     GET /api/v1/analytics/by-district
// @access    Private (ADMIN)
exports.getByDistrict = async (req, res, next) => {
  try {
    const data = await Fine.aggregate([
      { $match: { status: 'PAID' } },
      { $group: { 
          _id: '$districtId', 
          totalIssued: { $sum: 1 },
          revenue: { $sum: { $toDouble: '$amount' } } 
      }},
      { $lookup: { from: 'districts', localField: '_id', foreignField: '_id', as: 'district' } },
      { $unwind: '$district' },
      { $project: { 
          districtName: '$district.name', 
          province: '$district.province',
          totalIssued: 1, 
          revenue: 1 
      }},
      { $sort: { revenue: -1 } }
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
