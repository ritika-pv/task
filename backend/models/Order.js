const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  petId:[ {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "Pet",
  }],
  quantity: {
    type: Number,
    default:1
  },
  shipDate: {
    type: Date,
    default:Date.now() + 7*24*60*60*1000
  },
  status: {
    type: String,
    enum: ['placed', 'approved', 'delivered'],
    default:'placed'
  },
  complete: {
    type: Boolean,
    default: false,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;