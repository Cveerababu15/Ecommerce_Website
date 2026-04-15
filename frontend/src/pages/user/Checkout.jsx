import { orderAPI, paymentAPI } from "../../services/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaCreditCard, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useCart } from "../../context/CartContext";

function Checkout() {
  const toast = useToast();
  const { fetchCartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "", phone: "", line1: "", city: "", state: "", pincode: ""
  });
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create Order
      const orderRes = await orderAPI.create({ shippingAddress });
      const order = orderRes.data.order;

      // 2. Simulate complete Razorpay environment locally
      if (!order || order.totalPrice <= 0) throw new Error("Order Invalid or Zero Amount");

      // 3. Simulate Successful Razorpay Payment for Testing Purposes Without API Signup
      try {
        await paymentAPI.verify({
          orderId: order._id,
          razorpayPaymentId: "pay_test_" + Math.random().toString(36).substring(2, 10)
        });
        toast.success("Payment Successful!");
        fetchCartCount();
        navigate("/orders");
      } catch (err) {
        toast.error("Verification Failed");
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Order Creation Failed. Make sure your cart is not empty!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({...shippingAddress, [e.target.name]: e.target.value});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
          <FaShieldAlt className="text-4xl mx-auto mb-4 opacity-80" />
          <h1 className="text-3xl font-extrabold tracking-tight">Secure Checkout</h1>
          <p className="mt-2 text-purple-100 font-medium">Complete your shipping details to proceed</p>
        </div>

        <form onSubmit={handlePayment} className="p-8 space-y-6">
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <h3 className="text-xl font-bold border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
              Shipping Address
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="fullName" required placeholder="Full Name" onChange={handleAddressChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              <input type="text" name="phone" required placeholder="Phone Number" onChange={handleAddressChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            
            <input type="text" name="line1" required placeholder="Address Line 1 (Street, Area)" onChange={handleAddressChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" name="city" required placeholder="City" onChange={handleAddressChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              <input type="text" name="state" required placeholder="State" onChange={handleAddressChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              <input type="text" name="pincode" required placeholder="Pincode" onChange={handleAddressChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl flex items-center justify-between mt-8 border border-purple-100 dark:border-purple-900/50">
            <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
              <FaLock />
              <span className="font-semibold text-sm">Payments are 100% secure & encrypted</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-current"></div>
            ) : (
              <>
                <FaCreditCard />
                Pay & Place Order
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Checkout;