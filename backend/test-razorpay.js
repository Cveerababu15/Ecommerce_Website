const Razorpay = require("razorpay");
require("dotenv").config({ path: "d:/MERN_PROJECTS/Ecommerce-Project/backend/.env" });

const razorpay = new Razorpay({
    key_id: process.env.razorpay_key_id,
    key_secret: process.env.razorpay_key_secret
});

async function test() {
    try {
        const options = {
            amount: 1598 * 100,
            currency: "INR",
            receipt: "receipt#1" + Date.now()
        };
        const order = await razorpay.orders.create(options);
        console.log("Success:", order);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
