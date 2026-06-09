const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Payments Service on port ${PORT}`));
