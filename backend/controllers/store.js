const Pet = require("../models/Pet");
const Order = require("../models/Order");
const mongoose = require('mongoose');

exports.order = async (req, res) => {
    try {
        const { petId, quantity } = req.body;
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ success: false, message: "Pet Not Found" });
        }
        const order = await Order.create({ petId, quantity });
        return res.status(200).json({ message: "Order Placed", order })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

exports.getOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid pet ID  (enter correct   "TYPE"  of petId)' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found ' });
        }
        res.status(200).json({ message: 'Order found successfully', order });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};
exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID  (enter correct   "TYPE"  of petId)' });
        }
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (deletedOrder) {
            res.status(200).json({ message: 'Order deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

