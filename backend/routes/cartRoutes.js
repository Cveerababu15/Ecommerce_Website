const express=require("express");
const {addToCart,getCart}=require("../controllers/cartController.js")
const {auth}=require("../middleware/auth.js")
const router=express.Router();

router.post("/addtocart",auth,addToCart);
router.get("/getcart",auth,getCart);

module.exports=router;