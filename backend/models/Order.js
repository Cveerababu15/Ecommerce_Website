const mongoose=require("mongoose")
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, default: 1 },
            size: { type: String, default: null }
        }
    ],
    totalPrice: Number,
    shippingAddress: {
        fullName: String,
        phone: String,
        line1: String,
        city: String,
        state: String,
        pincode: String
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"]
    },
    razorpayOrderId: String,
    isPaid: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

module.exports=mongoose.model("Order",orderSchema)
