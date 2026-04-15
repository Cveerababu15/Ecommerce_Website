import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye } from "react-icons/fa";

function ProductCard({ product, addToCart }) {
  const navigate = useNavigate();
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col group relative"
      whileHover={{ y: -8 }}
    >
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
        <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-purple-600 dark:text-purple-400 text-xs font-bold rounded-full shadow-sm">
          {product.category || "Hot"}
        </span>
        {product.gender && (
          <span className="px-3 py-1 bg-indigo-600/90 text-white text-xs font-bold rounded-full shadow-sm">
            {product.gender}
          </span>
        )}
      </div>

      <Link to={`/product/${product._id}`} className="relative h-60 w-full overflow-hidden bg-gray-50 dark:bg-gray-800/50 block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="px-4 py-2 bg-white/95 text-gray-900 font-bold rounded-full shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <FaEye /> Quick View
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1 relative bg-white dark:bg-gray-800">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-extrabold text-xl mb-1 text-gray-900 dark:text-white line-clamp-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description || "Incredible design, remarkable value. Do not miss out on this fantastic offer."}
        </p>

        {product.sizes?.length > 0 && (
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">
            Sizes: {product.sizes.join(", ")}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-semibold line-through">₹{(product.price * 1.2).toFixed(0)}</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              ₹{product.price}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              if (product.sizes?.length) {
                navigate(`/product/${product._id}`);
              } else {
                addToCart(product);
              }
            }}
            title={product.sizes?.length ? "Choose size" : "Add to cart"}
            className="w-12 h-12 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-colors shadow-lg"
          >
            <FaShoppingCart />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;