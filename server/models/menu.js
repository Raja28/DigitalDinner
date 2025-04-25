const mongoose = require("mongoose")


const menuSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["Appetizer", "Main Course", "Dessert", "Drink"]
    },
    category: {
        type: String,
        required: true
    },
    is_vegan: {
        type: Boolean,
        required: true
    },
    is_gluten_free: {
        type: Boolean,
        required: true
    },
})

const Menu = mongoose.model("Menu", menuSchema)
module.exports = Menu