const Fine = require('../models/Fine');

const generateReferenceNo = async () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0,10).replace(/-/g,''); // e.g. 20260513
  
  const startOfDay = new Date(date.setHours(0,0,0,0));
  const endOfDay = new Date(date.setHours(23,59,59,999));

  const count = await Fine.countDocuments({ 
    createdAt: { $gte: startOfDay, $lte: endOfDay } 
  });
  
  const seq = String(count + 1).padStart(6, '0'); // e.g. 000123
  return `TF-${dateStr}-${seq}`; // TF-20260513-000123
};

module.exports = { generateReferenceNo };
