import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTachometerAlt, FaPlus, FaBoxOpen, FaShippingFast, FaSignOutAlt, FaSun, FaMoon, FaUserShield } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function AdminLayout({ children }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Add Product", path: "/admin/add-product", icon: <FaPlus /> },
    { name: "Manage Inventory", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Orders Setup", path: "/admin/orders", icon: <FaShippingFast /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      {/* Dynamic Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="hidden md:flex w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl flex-col z-50 sticky top-0 h-screen"
      >
        <div className="h-24 flex items-center gap-3 px-8 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <FaUserShield className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Admin Portal</h2>
            <p className="text-xs font-semibold text-purple-500">Secure Access</p>
          </div>
        </div>

        <ul className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${isActive
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40"
                        : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-gray-800 dark:hover:text-purple-400"
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-gray-700 dark:hover:text-yellow-400 transition-colors shadow-inner"
          >
            {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <FaSignOutAlt className="text-lg" />
            Sign Out
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white dark:bg-gray-900 h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm w-full">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
              <FaUserShield className="text-white text-sm" />
            </div>
            <h2 className="font-black text-gray-900 dark:text-white text-lg tracking-tight">Admin</h2>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
            {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          <button onClick={handleLogout} className="text-rose-500 p-2 bg-rose-50 dark:bg-rose-900/20 rounded-full">
            <FaSignOutAlt size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden relative flex flex-col w-full h-[calc(100vh-64px)] md:h-screen">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.02] bg-[length:32px_32px] pointer-events-none" />

        <div className="relative z-10 w-full flex-1 overflow-y-auto pb-24 md:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 sm:p-6 md:p-10 w-full"
          >
            {children}
          </motion.div>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 flex justify-around items-center h-16 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center w-full h-full relative ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {isActive && <motion.div layoutId="mobileNav" className="absolute top-0 w-8 h-1 bg-purple-600 rounded-b-full"></motion.div>}
                <span className={`text-xl transition-all ${isActive ? '-translate-y-1' : ''}`}>{item.icon}</span>
              </Link>
             );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;