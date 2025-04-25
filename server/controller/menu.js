const mongoose = require("mongoose")
const Menu = require("../models/menu")

const Cart = require("../models/cart")
const User = require("../models/user")
const Address = require("../models/address")
const Order = require("../models/order")

exports.fetchMenu = async (req, res) => {
    try {
        const { menuType } = req.params

        const menuList = await Menu.find({ type: menuType })

        return res.status(201).json({
            success: true,
            message: "Menu fetched successfully",
            data: menuList
        })
    } catch (error) {
        console.error("Error fetching menu:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.addToCart = async (req, res) => {
    try {
        const { menuItem } = req.body;
        const { user } = req;

        if (!menuItem) {
            return res.status(400).json({
                success: false,
                message: "Menu item ID is required"
            });
        }

        const newCart = await Cart.create({
            menuItem,
            user: user?._id
        });

        await User.findByIdAndUpdate(
            user?._id,
            { $push: { cart: newCart._id } }
        );

        const populatedCart = await Cart.findById(newCart._id).populate('menuItem');

        return res.status(201).json({
            success: true,
            message: "Item added to cart",
            newItem: populatedCart
        });

    } catch (error) {
        console.error("Add to Cart Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.body;
        const { user } = req;

        await Cart.findByIdAndDelete(cartItemId);

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $pull: { cart: cartItemId } },
            { new: true }
        )
        // .populate({
        //     path: 'cart',
        //     populate: {
        //         path: 'menuItem',
        //         model: 'Menu'
        //     }
        // })
        // .populate('orders');

        // const userObj = updatedUser.toObject();
        // delete userObj.password;

        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
            removedItem: cartItemId
        });

    } catch (error) {
        console.error("Remove from Cart Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.addressManager = async (req, res) => {
    try {
        const { name, address, contact, addressId } = req.body;
        const { user } = req
        if (!addressId) {
            // Create new address
            if (!name || !address || !contact) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide name, address & contact",
                });
            }

            const newAddress = await Address.create({ name, contact, address });
            await User.findByIdAndUpdate(user._id,
                { $push: { address: newAddress._id } },
                { new: true }
            )

            return res.status(200).json({
                success: true,
                message: "Address added successfully",
                address: newAddress,
            });
        } else {
            // Update only provided fields
            const updateFields = {};
            if (name) updateFields.name = name;
            if (contact) updateFields.contact = contact;
            if (address) updateFields.address = address;

            const updatedAddress = await Address.findByIdAndUpdate(
                addressId,
                updateFields,
                { new: true }
            );

            if (!updatedAddress) {
                return res.status(404).json({
                    success: false,
                    message: "Address not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Address updated successfully",
                address: updatedAddress,
            });
        }
    } catch (error) {
        console.error("Address Manager Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.body;
        const { user } = req;

        if (!addressId) {
            return res.status(400).json({
                success: false,
                message: "Please provide address ID",
            });
        }


        const userData = await User.findById(user._id);
        if (!userData.address.includes(addressId)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this address",
            });
        }

        const deletedAddress = await Address.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        await User.findByIdAndUpdate(user._id, {
            $pull: { address: addressId }
        });

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            address: deletedAddress
        });
    } catch (error) {
        console.error("Address Deletion Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

exports.updateCartQuantity = async (req, res) => {
    try {

        const { cartId, action } = req.body;
        const { user } = req

        if (!cartId || !action) {
            return res.status(400).json({
                success: false,
                message: "Cart item ID and action (increase/decrease) are required"
            });
        }

        const cartItem = await Cart.findById(cartId).populate('menuItem');

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        if (action === 'increase') {
            cartItem.quantity += 1;
        } else if (action === 'decrease') {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Quantity cannot be less than 1"
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid action. Use 'increase' or 'decrease'."
            });
        }

        // cartItem.updatedAt = Date.now();
        await cartItem.save();

        return res.status(200).json({
            success: true,
            message: `Cart item quantity ${action}d successfully`,
            updatedItem: cartItem
        });

    } catch (error) {
        console.error("Update Cart Quantity Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.fetchOrders = async (req, res) => {
    try {
        const { user } = req;

        const userDetails = await User.findById(user?._id)
            .populate({
                path: "orders",
                options: { sort: { createdAt: -1 } },
                populate: [
                    {
                        path: "cart", 
                        populate: {
                            path: "menuItem", 
                        }
                    },
                    {
                        path: "address", 
                    }
                ]
            })


        return res.status(200).json({
            success: true,
            message: "Fetched all orders",
            data: userDetails.orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
}

