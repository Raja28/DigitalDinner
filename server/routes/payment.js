const express = require('express');
const router = express.Router()

const { authorize } = require("../middlewares/auth")

const { capturePayment, verifyPayment } = require("../controller/payment");


router.post("/capturePayment", authorize, capturePayment)
router.post("/verifyPayment", authorize, verifyPayment)
// router.get("/TestingCode", TestingCode)

module.exports = router