import { Link } from "react-router-dom";
import { FaBoxOpen, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <FaBoxOpen className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              VeeraStore
            </h2>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
            Elevating your shopping experience with premium products, secure payments, and fast delivery.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <ul className="space-y-3 font-medium text-gray-500 dark:text-gray-400">
            <li><Link to="/products" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Shop All Products</Link></li>
            <li><Link to="/cart" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Your Cart</Link></li>
            <li><Link to="/orders" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">My Orders</Link></li>
            <li><Link to="/login" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Login to Account</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Connect With Us</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Follow us on social media for the latest updates and exclusive offers!
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 transition-all">
              <FaLinkedin />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/50 dark:hover:text-pink-400 transition-all">
              <FaInstagram />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:hover:text-white transition-all">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 py-6">
        <p className="text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 font-medium">
          © {new Date().getFullYear()} VeeraStore | Built with MERN by Veera
        </p>
      </div>
    </footer>
  );
}

export default Footer;