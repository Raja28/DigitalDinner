const mongoose = require("mongoose")
require('dotenv').config()

exports.DBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB)
        console.log("Digital Diner DB is Connected");

    } catch (error) {
        console.log(error);
        throw error
    }
}