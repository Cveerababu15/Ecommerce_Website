import { Link } from "react-router-dom";
import { useState } from "react";
import { FaShoppingCart, FaMoon, FaSun, FaSignOutAlt, FaBoxOpen, FaBars, FaTimes } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const isDark = theme === "dark";
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
            <FaBoxOpen className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
            VeeraStore
          </h1>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 font-semibold text-gray-600 dark:text-gray-300">
            <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Products</Link>
            <Link to="/orders" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">My Orders</Link>
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

          <Link to="/cart" className="relative group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <FaShoppingCart size={20} />
            </motion.div>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-md border-2 border-white dark:border-gray-900"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-gray-700 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
          >
            {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
          </motion.button>

          {isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 rounded-xl font-bold hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </motion.button>
          ) : (
            <Link to="/login" className="hidden md:flex">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <span>Login</span>
              </motion.button>
            </Link>
          )}
          
          {/* Mobile Menu Hamburger */}
          <button 
            className="md:hidden p-2 text-gray-700 dark:text-gray-200 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 absolute w-full left-0 top-full flex flex-col items-center py-6 space-y-6 shadow-2xl"
        >
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-xl text-gray-700 dark:text-gray-300 hover:text-purple-600">Home</Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-xl text-gray-700 dark:text-gray-300 hover:text-purple-600">Products</Link>
          <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-xl text-gray-700 dark:text-gray-300 hover:text-purple-600">My Orders</Link>
          {isLoggedIn ? (
            <button 
              onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
              className="font-bold text-xl text-rose-500 flex items-center gap-2 mt-4 px-6 py-2 bg-rose-50 dark:bg-rose-900/20 rounded-full"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-bold text-xl text-white flex items-center gap-2 mt-4 px-8 py-3 bg-gray-900 dark:bg-gray-700 rounded-full shadow-lg"
            >
              Login
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;