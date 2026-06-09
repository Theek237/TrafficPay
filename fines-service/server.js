const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', require('./routes/finesRoutes'));
app.use('/', require('./routes/systemRoutes'));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Fines Service on port ${PORT}`));
