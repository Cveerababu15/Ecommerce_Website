require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes=require("./routes/authRoutes.js")
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes=require("./routes/cartRoutes.js")
const orderRoutes=require("./routes/orderRoutes.js")
const paymentRoutes=require("./routes/paymentRoutes.js")

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/",(req,res)=>{
    res.send("server is Running Succussfully..")
})
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.use("/api/cart",cartRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/payment", paymentRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
