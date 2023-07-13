const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  petId: {
    type: Number,
    required: true,
  },
  
  shipDate: {
    type: Date,
    default:Date.now() + 7*24*60*60*1000
  },
  status: {
    type: String,
    enum: ['placed', 'approved', 'delivered'],
    required: true,
  },
  complete: {
    type: Boolean,
    default: false,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
