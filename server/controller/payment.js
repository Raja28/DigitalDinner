const { instance } = require("../config/razorpay")
const crypto = require("crypto");

const User = require("../models/user")
const Order = require("../models/order");
require("dotenv").config()


exports.capturePayment = async (req, res) => {
    try {
        const { total } = req.body;

        if (!total) {
            return res.status(400).json({
                success: false,
                message: "Product price (total) is required"
            });
        }

        const receiptId = crypto.randomUUID().split("-").join("")

        const options = {
            currency: "INR",
            amount: total * 100, // Convert to paisa
            receipt: receiptId
        };

        try {
            const paymentResponse = await instance.orders.create(options);

            return res.status(200).json({
                success: true,
                data: paymentResponse
            });

        } catch (error) {
            console.error("Order creation error:", error);
            return res.status(500).json({
                success: false,
                message: "Could not initiate order"
            });
        }

    } catch (error) {
        console.error("Payment capture error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while capturing payment"
        });
    }
};



exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount,
            receipt,
            deliveryAddressId
        } = req.body;

        const { user } = req;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !user?._id) {
            return res.status(400).json({
                success: false,
                message: "Missing required payment information"
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Signature mismatch – payment verification failed"
            });
        }

        // Signature is valid
        const userData = await User.findById(user._id);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const order = await Order.create({
            user: user._id,
            cart: [...userData.cart],
            address: deliveryAddressId,
            totalPrice: amount
        });

        await User.findByIdAndUpdate(
            user._id,
            {
                $set: { cart: [] },
                $push: { orders: order._id }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Payment verified and order placed successfully"
        });

    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while verifying payment"
        });
    }
};
