const razorpay=require("../config/razorpay.js")
const Order=require("../models/Order.js")

exports.createpayment=async(req,res)=>{
    try {
        const {amount}=req.body;

        if(!amount){
            return res.status(400).json({message:"Amount is required"})
        }
        const options={
            amount:amount*100, // in paise
            currency:"INR",
            receipt:"receipt_"+Date.now()
        }
    const order=await razorpay.orders.create(options);
    res.status(200).json({
        success:true,
        message:"Payment order created successfully",
        order
    })


    } catch (error) {
        console.error("Create Payment Error Object:", error);
        res.status(500).json({
            message: "Error creating payment", 
            error: error.error ? error.error.description : (error.message || error)
        });
        
    }
}

exports.verifyPayment=async(req,res)=>{
    try {
        const {orderId}=req.body;
        const order=await Order.findById(orderId);

        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        order.isPaid=true;
        order.status="Processing";
        await order.save();
        res.status(200).json({success:true,message:"Payment successful and order updated",order})
    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({message: "Error verifying payment", error: error.message});
        
    }
}