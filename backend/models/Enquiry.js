// models/Enquiry.js
// Mongoose schema for admission enquiry form submissions

const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    parentName: {
      type: String,
      required: [true, 'Parent name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    classApplying: {
      type: String,
      required: [true, 'Class applying for is required'],
      enum: [
        'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3',
        'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8',
        'Class 9', 'Class 10', 'Class 11 (Science)',
        'Class 11 (Commerce)', 'Class 11 (Arts)', 'Class 12 (Science)',
        'Class 12 (Commerce)', 'Class 12 (Arts)',
      ],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'contacted'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
