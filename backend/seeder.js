require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Models
const District = require('./models/District');
const FineCategory = require('./models/FineCategory');

const districtsData = [
  { code: 'CMB', name: 'Colombo', province: 'Western' },
  { code: 'GMP', name: 'Gampaha', province: 'Western' },
  { code: 'KLT', name: 'Kalutara', province: 'Western' },
  { code: 'KDY', name: 'Kandy', province: 'Central' },
  { code: 'MTL', name: 'Matale', province: 'Central' },
  { code: 'NUW', name: 'Nuwara Eliya', province: 'Central' },
  { code: 'GLG', name: 'Galle', province: 'Southern' },
  { code: 'MTR', name: 'Matara', province: 'Southern' },
  { code: 'HMB', name: 'Hambantota', province: 'Southern' },
  { code: 'JFN', name: 'Jaffna', province: 'Northern' }
];

const categoriesData = [
  { code: 'SP-01', name: 'Speeding 1–20 km/h over', amount: 1500, demeritPoints: 2, legalRef: 'S.138(1)' },
  { code: 'SP-02', name: 'Speeding 21–40 km/h over', amount: 3000, demeritPoints: 4, legalRef: 'S.138(1)' },
  { code: 'SP-03', name: 'Speeding 41+ km/h over', amount: 6000, demeritPoints: 6, legalRef: 'S.138(2)' },
  { code: 'DUI-01', name: 'Driving under influence', amount: 25000, demeritPoints: 10, legalRef: 'S.151' },
  { code: 'SBT-01', name: 'Not wearing seat belt', amount: 1000, demeritPoints: 1, legalRef: 'S.148(1)' },
  { code: 'MOB-01', name: 'Using mobile while driving', amount: 2500, demeritPoints: 3, legalRef: 'S.149' },
  { code: 'RLS-01', name: 'Running red signal', amount: 3000, demeritPoints: 4, legalRef: 'S.135' }
];

const seedData = async () => {
  try {
    await connectDB();

    await District.deleteMany();
    await FineCategory.deleteMany();

    await District.insertMany(districtsData);
    console.log('Districts Seeded');

    await FineCategory.insertMany(categoriesData);
    console.log('Fine Categories Seeded');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
