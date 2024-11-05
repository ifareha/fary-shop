const mongoose = require('mongoose');

// Mongoose Schema
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
  },
  paymentId: {
    type: String,
  },
  signatureId: {
    type: String,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['USD', 'INR', 'EUR'], // Example of limiting to specific currencies
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed', 'failed'], // Enum to allow only specific statuses
  },
}, { timestamps: true });


module.exports = {
  paymentModel  : mongoose.model('payment', paymentSchema),
};
