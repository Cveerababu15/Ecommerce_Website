const express=require("express");
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const { auth } = require("../middleware/auth");

const router=express.Router();

router.post("/create", auth, createOrder);
router.get("/user-orders", auth, getUserOrders);
router.get("/all-orders", auth, getAllOrders);
router.put("/update-status", auth, updateOrderStatus);

module.exports=router;
