import { useEffect, useState } from "react";
import { orderAPI } from "../../services/api";
import { motion } from "framer-motion";
import { FaShippingFast, FaCheckCircle, FaTimesCircle, FaClock, FaBoxOpen, FaEdit } from "react-icons/fa";
import { useToast } from "../../context/ToastContext";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAll();
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await orderAPI.updateStatus({
        orderId: id,
        status: newStatus
      });
      toast.success("Order status updated realistically!");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Pending": return <FaClock className="text-orange-500" />;
      case "Processing": return <FaBoxOpen className="text-blue-500" />;
      case "Shipped": return <FaShippingFast className="text-indigo-500" />;
      case "Out for Delivery": return <FaShippingFast className="text-purple-500 text-xl animate-pulse" />;
      case "Delivered": return <FaCheckCircle className="text-green-500" />;
      case "Cancelled": return <FaTimesCircle className="text-red-500" />;
      default: return <FaCheckCircle className="text-gray-500" />;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case "Pending": return "bg-orange-500";
      case "Processing": return "bg-blue-500";
      case "Shipped": return "bg-indigo-500";
      case "Out for Delivery": return "bg-purple-500";
      case "Delivered": return "bg-green-500";
      case "Cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <FaShippingFast className="text-white text-2xl" />
        </div>
        <div>
           <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
             Order Logistics
           </h1>
           <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">Manage, update, and track customer fulfillments</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 shadow-xl"></div>
        </div>
      ) : orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <FaBoxOpen className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-2xl font-bold dark:text-white">No active orders found.</p>
          <p className="text-gray-500 mt-2">Waiting for new customers to check out.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((o, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={o._id} 
              className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
            >
              {/* Dynamic Status Sidebar */}
              <div className={`absolute top-0 left-0 w-2 h-full ${getStatusBg(o.status)} group-hover:w-3 transition-all duration-300`}></div>
              
              <div className="ml-2">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      Order Reference
                    </h2>
                    <p className="text-lg font-mono font-black text-gray-900 dark:text-white mt-1">
                      #{o._id.substring(o._id.length - 8)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                       {getStatusIcon(o.status)}
                       <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{o.status}</span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 text-left sm:text-right bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <p className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-1">Total Value</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                       ₹{o.totalPrice}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm font-semibold w-full md:w-auto">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-purple-600">
                      {o.userId?.name?.substring(0, 2).toUpperCase() || "US"}
                    </div>
                    <div>
                       <p className="text-xs text-gray-400 uppercase tracking-wider">{o.userId?.name || "Customer"}</p>
                       <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{o.userId?.email || "Unknown"}</p>
                    </div>
                  </div>

                  <div className="relative w-full md:w-auto mt-4 md:mt-0 flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                       <FaEdit className="text-gray-500" />
                    </div>
                    <div className="relative flex-1">
                      <select 
                        value={o.status} 
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="w-full appearance-none bg-transparent text-gray-800 dark:text-white pl-2 pr-8 py-2 font-black cursor-pointer focus:outline-none"
                      >
                        <option value="Pending" className="dark:bg-gray-800 font-bold">Pending</option>
                        <option value="Processing" className="dark:bg-gray-800 font-bold">Processing</option>
                        <option value="Shipped" className="dark:bg-gray-800 font-bold">Shipped</option>
                        <option value="Out for Delivery" className="dark:bg-gray-800 font-bold">Out for Delivery</option>
                        <option value="Delivered" className="dark:bg-gray-800 font-bold text-green-500">Delivered</option>
                        <option value="Cancelled" className="dark:bg-gray-800 font-bold text-red-500">Cancelled</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageOrders;