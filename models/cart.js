const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema with validations
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User is required']
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
  }],
  totalPrice: {
    type: Number,
    default: 0,
    min: [0, 'Total price cannot be negative']
  }
});

// Joi schema for cart validation
const validateCart = (cartData) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    products: Joi.array().items(Joi.string()).min(1).required(),
    totalPrice: Joi.number().min(0).optional()
  });
  
  return schema.validate(cartData);
};

module.exports = {
  cartModel: mongoose.model('cart', cartSchema),
  validateCart
};
