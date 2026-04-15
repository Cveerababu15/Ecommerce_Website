import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShoppingBag, FaStar } from "react-icons/fa";

function Hero() {
  return (
    <div className="relative w-full bg-[#f8f9fa] dark:bg-gray-950 overflow-hidden">
      {/* Abstract Modern Geometrics */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-purple-100/50 to-transparent dark:from-purple-900/10 z-0"></div>
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 translate-x-1/2 -translate-y-1/4 blur-3xl z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Typography Block */}
        <motion.div
          className="flex-1 w-full space-y-8 text-center lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-xs tracking-widest uppercase border border-purple-200/50 dark:border-purple-800/50 shadow-sm">
            <FaStar className="text-yellow-500" />
            <span>Premium E-Commerce Platform</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.05]">
            Redefine <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Perfection.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Experience shopping reimagined. Highly curated electronics, modern fashion lines, and uncompromised quality specifically for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-full shadow-2xl hover:shadow-gray-900/20 dark:hover:shadow-white/20 flex items-center justify-center gap-4 transition-all"
              >
                <FaShoppingBag className="text-xl" />
                <span className="text-lg">Shop Collection</span>
              </motion.button>
            </Link>

            {!localStorage.getItem("token") && (
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-10 py-5 bg-transparent text-gray-900 dark:text-white font-black rounded-full border-2 border-gray-900 dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900/50 flex items-center justify-center transition-all"
                >
                  <span className="text-lg">Join Now</span>
                  <FaArrowRight className="ml-2" />
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Right Modern Imagery Frame */}
        <motion.div
          className="flex-1 w-full relative hidden lg:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-full aspect-[4/5] max-w-lg mx-auto">
            {/* Primary Portrait */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent rounded-[2.5rem] z-10"></div>
            <img
              src="https://img.freepik.com/free-vector/flat-sale-landing-page-template-with-photo_23-2149028522.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Premium Tech"
              className="w-full h-full object-cover rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-purple-900/20 grayscale-[20%] transition-transform hover:scale-[1.02] duration-700"
            />

            {/* Floating Badge */}
            <motion.div
              className="absolute top-10 -left-12 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 z-20"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">New Arrivals</p>
              <p className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Winter '26</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
