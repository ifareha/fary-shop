const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema with validations
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must not exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin',
  }
});

const validateAdmin = (adminData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('admin', 'superadmin').optional()
  });
  
  return schema.validate(adminData);
};

module.exports = {
  adminModel : mongoose.model('admin', adminSchema),
  validateAdmin
};
