require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Example API (no database)
app.post('/api/enquiry', (req, res) => {
  console.log(req.body); // logs form data
  res.json({ success: true, message: "Form submitted" });
});

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// catch all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});