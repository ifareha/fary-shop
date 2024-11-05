const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema with validations
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    minlength: [3, 'Category name must be at least 3 characters long'],
    maxlength: [30, 'Category name must not exceed 30 characters']
  }
});

// Joi schema for category validation
const validateCategory = (categoryData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required()
  });
  
  return schema.validate(categoryData);
};

module.exports = {
  categoryModel: mongoose.model('category', categorySchema),
  validateCategory
};
