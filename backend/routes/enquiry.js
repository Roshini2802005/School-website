// routes/enquiry.js
// API routes for handling admission enquiries

const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const nodemailer = require('nodemailer');

// ─── Email Helper ─────────────────────────────────────────────────────────────
const sendEmailNotification = async (enquiry) => {
  // Only send if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email to admin
  const adminMail = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `📩 New Admission Enquiry - ${enquiry.studentName}`,
    html: `
      <h2>New Admission Enquiry Received</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Student Name</strong></td><td style="padding:8px;border:1px solid #ddd">${enquiry.studentName}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Parent Name</strong></td><td style="padding:8px;border:1px solid #ddd">${enquiry.parentName}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${enquiry.email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd">${enquiry.phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Class Applying For</strong></td><td style="padding:8px;border:1px solid #ddd">${enquiry.classApplying}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd">${enquiry.message || 'N/A'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Submitted On</strong></td><td style="padding:8px;border:1px solid #ddd">${new Date().toLocaleString()}</td></tr>
      </table>
    `,
  };

  // Confirmation email to parent
  const parentMail = {
    from: process.env.EMAIL_USER,
    to: enquiry.email,
    subject: 'Enquiry Received - Sunrise International School',
    html: `
      <h2>Thank you for your enquiry!</h2>
      <p>Dear ${enquiry.parentName},</p>
      <p>We have received your admission enquiry for <strong>${enquiry.studentName}</strong> for <strong>${enquiry.classApplying}</strong>.</p>
      <p>Our admissions team will contact you within 2 working days.</p>
      <br/>
      <p>Warm regards,<br/><strong>Admissions Team</strong><br/>Sunrise International School</p>
    `,
  };

  await transporter.sendMail(adminMail);
  await transporter.sendMail(parentMail);
};

// ─── POST /api/enquiry ─────────────────────────────────────────────────────────
// Submit a new admission enquiry
router.post('/', async (req, res) => {
  try {
    const { studentName, parentName, email, phone, classApplying, message } = req.body;

    // Create and save enquiry to MongoDB
    const enquiry = new Enquiry({
      studentName,
      parentName,
      email,
      phone,
      classApplying,
      message,
    });

    await enquiry.save();

    // Send email notifications (non-blocking; errors won't fail the request)
    sendEmailNotification(enquiry).catch((err) =>
      console.warn('Email notification failed:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! We will contact you soon.',
      data: { id: enquiry._id },
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('Enquiry submission error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// ─── GET /api/enquiry (Admin) ──────────────────────────────────────────────────
// Retrieve all enquiries (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};

    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Enquiry.countDocuments(filter);

    res.json({ success: true, total, page: parseInt(page), data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── PATCH /api/enquiry/:id (Admin) ───────────────────────────────────────────
// Update enquiry status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
