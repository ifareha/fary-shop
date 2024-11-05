const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema with validations
const orderSchema = new mongoose.Schema({
  orderId : {
 type : String,
 required : [true, 'Order ID is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User reference is required']
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: [true, 'At least one product is required']
  }],
  totalPrice: {
    type: Number,
    default: 0,
    min: [0, 'Total price cannot be negative']
  },
  address: {
    type: String,
    minlength: [10, 'Address must be at least 10 characters long'],
    maxlength: [255, 'Address cannot exceed 255 characters']
  },
  status: {
    type: String,
    enum: ['pending','processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    required: [true, 'Order status is required']
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'payment',
    required: [true, 'Payment method is required']
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'delivery',
  }
});

// Joi schema for order validation
const validateOrder = (orderData) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    user: Joi.string().required(),
    products: Joi.array().items(Joi.string().required()).min(1).required(),
    totalPrice: Joi.number().min(0).required(),
    address: Joi.string().min(10).max(255),
    status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled').required(),
    paymentMethod: Joi.string().required(),
    delivery: Joi.string()
  });
  
  return schema.validate(orderData);
};

module.exports = {
  orderModel: mongoose.model('order', orderSchema),
  validateOrder
};
