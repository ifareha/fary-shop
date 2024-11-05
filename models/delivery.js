const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema with validations
const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order reference is required']
  },
  deliveryBoy: {
    type: String,
    required: [true, 'Delivery boy name is required'],
    minlength: [3, 'Delivery boy name must be at least 3 characters long'],
    maxlength: [50, 'Delivery boy name must not exceed 50 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending',
    required: [true, 'Delivery status is required']
  },
  trackingUrl: {
    type: String,
    required: [true, 'Tracking URL is required']
  },
  estimatedDeliveryTime: {
    type: Number,
    min: [0, 'Estimated delivery time cannot be negative'],
    required: [true, 'Estimated delivery time is required']
  }
});

// Joi schema for delivery validation
const validateDelivery = (deliveryData) => {
  const schema = Joi.object({
    order: Joi.string().required(),
    deliveryBoy: Joi.string().min(3).max(50).required(),
    status: Joi.string().valid('pending', 'in-transit', 'delivered', 'cancelled').required(),
    trackingUrl: Joi.string().required(),
    estimatedDeliveryTime: Joi.number().min(0).required()
  });
  
  return schema.validate(deliveryData);
};

module.exports = {
  deliverymodel: mongoose.model('delivery', deliverySchema),
  validateDelivery
};
