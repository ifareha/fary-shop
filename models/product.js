const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema with validations
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    minlength: [3, 'Product name must be at least 3 characters long'],
    maxlength: [100, 'Product name must not exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    minlength: [3, 'Category must be at least 3 characters long'],
    maxlength: [50, 'Category must not exceed 50 characters']
  },
  stock: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: Buffer,
  }
});

// Joi schema for product validation
const validateProduct = (productData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().positive().required(),
    category: Joi.string().min(3).max(50).required(),
    stock: Joi.number().required(),
    description: Joi.string().min(10).max(1000),
    image: Joi.string()
  });
  
  return schema.validate(productData);
};

module.exports = {
  productModel: mongoose.model('product', productSchema),
  validateProduct
};
