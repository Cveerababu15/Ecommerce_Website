const Order=require("../models/Order.js")
const Cart=require("../models/Cart.js")
const Product=require("../models/Product.js")

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddress } = req.body;
        const cart = await Cart.findOne({ userId })
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        }
        let totalPrice = 0;
        for (const item of cart.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                totalPrice += product.price * item.quantity;
            }
        }
        const order = await Order.create({
            userId,
            products: cart.products,
            totalPrice,
            shippingAddress
        })

        // clearcart
        await Cart.findOneAndUpdate({ userId }, { $set: { products: [] } })
        res.status(201).json({ success: true, message: "Order created successfully", order });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
}

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate("products.productId").sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user orders", error: error.message });
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email").populate("products.productId").sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching all orders", error: error.message });
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ success: true, message: "Status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
}