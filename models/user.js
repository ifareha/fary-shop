const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Address Schema with validations
const addressSchema = new mongoose.Schema({
  state: {
    type: String,
    required: [true, 'State is required'],
    minlength: [2, 'State must be at least 2 characters long'],
    maxlength: [50, 'State must not exceed 50 characters']
  },
  zip: {
    type: Number,
    required: [true, 'ZIP code is required'],
    minlength: [5, 'ZIP code must be at least 5 digits'],
    maxlength: [10, 'ZIP code must not exceed 10 digits']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    minlength: [2, 'City must be at least 2 characters long'],
    maxlength: [100, 'City must not exceed 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    minlength: [5, 'Address must be at least 5 characters long'],
    maxlength: [255, 'Address must not exceed 255 characters']
  }
});

// Mongoose User Schema with validations
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [100, 'Name must not exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  phone: {
    type: Number,
    minlength: [10, 'Phone number must be at least 10 digits'],
    maxlength: [15, 'Phone number must not exceed 15 digits']
  },
  addresses: [addressSchema],
  googleId: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Joi schema for user validation
const validateUser = (userData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6),
    phone: Joi.string().pattern(/^\d+$/).min(10).max(15).required(),
    addresses: Joi.array().items(
      Joi.object({
        state: Joi.string().min(2).max(50).required(),
        zip: Joi.number().min(10000).max(9999999999).required(),
        city: Joi.string().min(2).max(100).required(),
        address: Joi.string().min(5).max(255).required()
      })
    ),
    googleId: Joi.string().allow(null, '')
  });
  
  return schema.validate(userData);
};

module.exports = {
  userModel: mongoose.model('user', userSchema),
  validateUser
};
