const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(morgan('dev'));

// Routing to microservices
app.use('/api/v1/auth', createProxyMiddleware({ target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001', changeOrigin: true }));
app.use('/api/v1/fines', createProxyMiddleware({ target: process.env.FINES_SERVICE_URL || 'http://localhost:5002', changeOrigin: true }));
app.use('/api/v1/payments', createProxyMiddleware({ target: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:5003', changeOrigin: true }));
app.use('/api/v1/system', createProxyMiddleware({ target: process.env.FINES_SERVICE_URL || 'http://localhost:5002', changeOrigin: true }));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
