import { motion } from "framer-motion";
import { FaBoxOpen, FaShoppingCart, FaRupeeSign, FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import { productAPI, orderAPI } from "../../services/api";

function Dashboard() {
  const [data, setData] = useState({
    totalInventory: 0,
    ordersPending: 0,
    revenue: 0,
    activeUsers: 0,
    recentOrders: [],
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          productAPI.getAllAdmin(),
          orderAPI.getAll()
        ]);
        
        const products = productsRes.data.products || [];
        const orders = ordersRes.data.orders || [];
        
        const pendingCount = orders.filter(o => o.status === "Pending").length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        
        const uniqueUsers = new Set(orders.filter(o => o.userId?._id).map(o => o.userId._id.toString())).size;
        
        setData({
          totalInventory: products.length,
          ordersPending: pendingCount,
          revenue: totalRevenue,
          activeUsers: uniqueUsers,
          recentOrders: orders.slice(0, 4),
          loading: false
        });
      } catch (error) {
        console.error("Failed to load dashboard data");
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Total Inventory", value: data.loading ? "..." : data.totalInventory, icon: <FaBoxOpen />, color: "from-blue-500 to-cyan-400" },
    { title: "Orders Pending", value: data.loading ? "..." : data.ordersPending, icon: <FaShoppingCart />, color: "from-orange-500 to-yellow-400" },
    { title: "Revenue (INR)", value: data.loading ? "..." : `₹${Math.abs(data.revenue).toLocaleString()}`, icon: <FaRupeeSign />, color: "from-green-500 to-emerald-400" },
    { title: "Active Shoppers", value: data.loading ? "..." : data.activeUsers, icon: <FaUsers />, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full pb-10">
      {/* Admin Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-purple-900 dark:to-indigo-950 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-8 md:p-16 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 mix-blend-overlay rounded-full blur-3xl transform translate-x-32 -translate-y-32 z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 opacity-20 mix-blend-overlay rounded-full blur-3xl transform -translate-x-32 translate-y-32 z-0"></div>

        <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-purple-100 font-extrabold text-xs tracking-widest shadow-sm border border-white/10 uppercase">
            Live Metrics
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Welcome back, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">Super Admin</span>
          </h1>
          <p className="text-purple-100/80 text-base md:text-lg font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
            Real-time insights across your digital business empire.
          </p>
        </div>

        <div className="relative z-10 mt-10 md:mt-0 hidden sm:block">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-40 h-40 md:w-48 md:h-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl flex items-center justify-center transform rotate-3"
          >
            <FaRupeeSign className="text-7xl md:text-8xl text-white opacity-90 drop-shadow-xl" />
          </motion.div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">{stat.title}</h3>
              <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Activity - Recent Orders */}
      <div className="mt-12 w-full bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
           <FaShoppingCart className="text-purple-500" /> Recent Activity
        </h3>
        {data.loading ? (
           <div className="h-48 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
           </div>
        ) : (
          <div className="space-y-4">
              {data.recentOrders?.length > 0 ? data.recentOrders.map((order, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   key={i} 
                   className="flex flex-col sm:flex-row justify-between sm:items-center p-5 bg-gray-50 dark:bg-gray-900/50 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 gap-4"
                 >
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                        {order.userId?.name?.substring(0,2).toUpperCase() || "US"}
                     </div>
                     <div>
                       <p className="font-extrabold text-gray-900 dark:text-white text-lg">{order.userId?.name || "Verified Customer"}</p>
                       <p className="text-sm text-gray-500 font-medium">#{order._id.substring(order._id.length - 8)} &bull; {order.products?.length || 0} items purchased</p>
                     </div>
                   </div>
                   <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                     <p className="font-black text-xl text-purple-600 dark:text-purple-400">₹{order.totalPrice}</p>
                     <p className={`text-xs font-bold px-3 py-1 rounded-full mt-1 ${
                       order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                       order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                       'bg-blue-100 text-blue-600'
                     }`}>
                       {order.status}
                     </p>
                   </div>
                 </motion.div>
              )) : (
                <div className="py-12 text-center text-gray-500 font-medium bg-gray-50 dark:bg-gray-900/30 rounded-3xl border border-gray-100 dark:border-gray-800 text-lg">
                  No recent orders available.
                </div>
              )}
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;