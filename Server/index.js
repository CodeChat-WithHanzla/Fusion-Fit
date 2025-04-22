const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const http = require("http");
require('dotenv').config({ path: './config/.env' });


// Connect to the database
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configure CORS
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/product', require('./routes/productRoute'));
app.use('/api/order', require('./routes/orderRoute'));
app.use('/api/admin', require('./routes/adminRoute'));

const port = process.env.PORT || 7000;


app.get("/", (req, res) => {
    res.send(`Test Route`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});