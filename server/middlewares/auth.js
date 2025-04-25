const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.authorize = async (req, res, next) => {
    try {

        const token = req.header('Authorization').replace("Bearer ", "")

        if (!token) {
            return res.status(401).json({
                success: "false",
                message: "token missing"
            })
        }

        try {
            const tokenData = jwt.verify(token, process.env.JWT_SECRET)
            req.user = tokenData

            next()

        } catch (error) {
            console.log("Token verification error:", error);

            res.status(401).json({
                success: false,
                message: "invalid token or expired"
            })
        }

    } catch (error) {
        console.log("Authorization middleware error:", error);

        res.status(401).json({
            success: false,
            message: "error while validating token"
        })
    }
}