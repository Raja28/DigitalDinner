const { default: mongoose } = require("mongoose");

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
  
    createdAt: {
        type: Date,
        default: Date.now()
    },

    updatedAt: {
        type: Date,
        default: Date.now()
    }

})
addressSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Address = mongoose.model("Address", addressSchema)
module.exports = Address