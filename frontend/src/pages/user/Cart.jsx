import { useEffect, useState } from "react";
import { cartAPI } from "../../services/api";
import { motion } from "framer-motion";
import { FaTrash, FaShoppingCart, FaCreditCard } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Cart() {
  const [cart, setCart] = useState(null);
  const { fetchCartCount } = useCart();
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart();
      setCart(res.data.cart);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const linePayload = (id, quantity, size) => {
    const body = { productId: id, quantity };
    if (size) body.size = size;
    return body;
  };

  const updateQuantity = async (id, delta, lineSize) => {
    try {
      await cartAPI.addToCart(linePayload(id, delta, lineSize));
      fetchCart();
      fetchCartCount();
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (id, currentQty, lineSize) => {
    try {
      await cartAPI.addToCart(linePayload(id, -currentQty, lineSize));
      fetchCart();
      fetchCartCount();
    } catch (error) {
      console.error(error);
    }
  };

  // Safely reduce based on products
  const totalPrice = cart?.products?.reduce((acc, item) => {
    if (item.productId && item.productId.price) {
      return acc + (item.productId.price * item.quantity);
    }
    return acc;
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
            <FaShoppingCart className="text-3xl text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Cart</h1>
            <p className="text-gray-500">Review your handpicked items</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : !cart || !cart.products || cart.products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white dark:bg-gray-800 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-5xl text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold dark:text-white mb-4">Your cart is empty</h2>
            <Link to="/products">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Continue Shopping
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* INVENTORY LIST */}
            <div className="flex-1 space-y-4">
              {cart.products.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={`${item.productId?._id || index}-${item.size ?? ""}`}
                  className="flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0 shadow-inner">
                    <img
                      src={item.productId?.image || "https://via.placeholder.com/150"}
                      className="w-full h-full object-cover"
                      alt={item.productId?.name}
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold dark:text-white mb-1">
                      {item.productId?.name || "Unknown Product"}
                    </h2>
                    {item.size && (
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Size: {item.size}</p>
                    )}
                    <p className="text-2xl font-black text-purple-600">
                      ₹{item.productId?.price || 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Qty</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.productId?._id, -1, item.size)}
                          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 flex items-center justify-center font-bold text-lg dark:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl font-bold text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 shadow-inner">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.productId?._id, 1, item.size)}
                          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 flex items-center justify-center font-bold text-lg dark:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.productId?._id, item.quantity, item.size)}
                      className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/30 text-red-500 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      title="Remove Item"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full lg:w-96 bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 h-fit sticky top-24"
            >
              <h2 className="text-2xl font-bold dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-8 text-lg">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-500 font-semibold">Free</span>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4 flex justify-between">
                  <span className="text-xl font-bold dark:text-white">Total</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              <Link to="/checkout" className="block">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                >
                  <FaCreditCard />
                  Proceed to Checkout
                </motion.button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;