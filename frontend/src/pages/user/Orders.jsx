import { useEffect, useState } from "react";
import { orderAPI } from "../../services/api";
import { motion } from "framer-motion";
import { FaBoxOpen, FaCheckCircle, FaClock, FaTruck, FaTimesCircle } from "react-icons/fa";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusInfo = (status) => {
    switch (status) {
      case "Pending": return { bg: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: <FaClock /> };
      case "Processing": return { bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <FaBoxOpen /> };
      case "Shipped": return { bg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", icon: <FaTruck /> };
      case "Out for Delivery": return { bg: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: <FaTruck /> };
      case "Delivered": return { bg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <FaCheckCircle /> };
      case "Cancelled": return { bg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: <FaTimesCircle /> };
      default: return { bg: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", icon: <FaCheckCircle /> };
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getUserOrders();
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <FaBoxOpen className="text-purple-600" /> My Orders
          </h1>
          <p className="text-gray-500 mt-2">Track and manage your recent purchases</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <FaBoxOpen className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-2xl font-bold dark:text-white">You have no orders yet!</p>
            <p className="text-gray-500 mt-2">Time to start shopping and fill this up.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={order._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden"
              >
                {/* Decorative header */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pt-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Order ID
                    </h2>
                    <p className="text-lg font-mono font-bold text-gray-900 dark:text-gray-200">
                      #{order._id.substring(order._id.length - 8)}
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                      ₹{order.totalPrice}
                    </p>
                    <div className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold shadow-sm ${getStatusInfo(order.status).bg}`}>
                      {getStatusInfo(order.status).icon}
                      {order.status}
                    </div>
                  </div>
                </div>

                {/* PRODUCTS LIST */}
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-700 dark:text-gray-300">Items Purchased</h3>
                  {order.products && order.products.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 tracking-tighter text-xs font-bold font-mono overflow-hidden shrink-0 border border-purple-200 dark:border-purple-800/50">
                           {item.productId?.image ? (
                             <img src={item.productId.image} alt="product" className="w-full h-full object-cover" />
                           ) : (
                             "ITM"
                           )}
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {item.productId?.name || item.productId}
                          {item.size ? (
                            <span className="block text-xs font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                              Size {item.size}
                            </span>
                          ) : null}
                        </span>
                      </div>
                      <span className="inline-block bg-white dark:bg-gray-800 px-3 py-1 rounded-md text-sm font-bold text-gray-600 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-600">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;