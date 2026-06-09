require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Lanka Traffic Fine System API is running...');
});

// Import Routes (to be added)
// app.use('/api/v1/auth', require('./routes/authRoutes'));
// app.use('/api/v1/fine-categories', require('./routes/fineCategoriesRoutes'));
// app.use('/api/v1/fines', require('./routes/finesRoutes'));
// app.use('/api/v1/payments', require('./routes/paymentRoutes'));
// app.use('/api/v1/notifications', require('./routes/notificationRoutes'));
// app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));
// app.use('/api/v1/districts', require('./routes/districtRoutes'));
// app.use('/api/v1/users', require('./routes/userRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
