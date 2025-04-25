const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    totalPrice: {
        type: Number,
        required: true
    },
    
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
