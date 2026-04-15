const express=require("express");
const { auth } = require("../middleware/auth");
const { createpayment, verifyPayment } = require("../controllers/paymentController");
const router=express.Router();
router.post("/create",auth,createpayment);
router.post("/verify",auth,verifyPayment)
module.exports=router;