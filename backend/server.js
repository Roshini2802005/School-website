// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/enquiry', require('./routes/enquiry'));

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});