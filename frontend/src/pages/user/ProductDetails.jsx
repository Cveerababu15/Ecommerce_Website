import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productAPI, cartAPI } from "../../services/api";
import { useCart } from "../../context/CartContext";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import { FaShoppingCart, FaArrowLeft, FaStar, FaShieldAlt, FaTruck } from "react-icons/fa";
import { useToast } from "../../context/ToastContext";

function ProductDetails() {
  const toast = useToast();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const { fetchCartCount } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productAPI.getAllAdmin();
        const found = res.data.products?.find((p) => p._id === id);
        if (found) {
          setProduct(found);
          const offered = found.sizes?.length ? found.sizes : [];
          setSelectedSize(offered.length ? offered[0] : null);
        } else {
          toast.error("Product not found.");
        }
      } catch (error) {
        console.error("Error fetching product details", error);
        toast.error("Could not load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      if (product.sizes?.length && !selectedSize) {
        toast.error("Please select a size.");
        return;
      }
      const payload = {
        productId: product._id,
        quantity: 1
      };
      if (product.sizes?.length) payload.size = selectedSize;

      await cartAPI.addToCart(payload);
      fetchCartCount();
      toast.success(`${product.name} seamlessly added to cart!`);
    } catch (error) {
      toast.error("Please login to add to cart!");
    }
  };

  if (loading) return <Loader />;
  
  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 dark:text-white">
      <h2 className="text-2xl font-bold">Product not found</h2>
      <Link to="/products" className="text-purple-600 hover:underline">Go back to amazing products</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold mb-8 transition-colors">
          <FaArrowLeft /> Back to Collection
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row">
          
          {/* Product Image Panel */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 relative">
            <div className="absolute top-8 left-8 z-10 flex flex-col gap-2 items-start">
              <span className="py-1 px-3 bg-white dark:bg-gray-700 rounded-full shadow border border-gray-200 dark:border-gray-600 text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                {product.category || "Premium"}
              </span>
              {product.gender && (
                <span className="py-1 px-3 bg-indigo-600 text-white rounded-full text-xs font-black shadow">
                  {product.gender}
                </span>
              )}
            </div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               whileHover={{ scale: 1.05 }}
               transition={{ duration: 0.5 }}
               className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format"} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Product Info Panel */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-yellow-400 mb-4">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar className="text-gray-300 dark:text-gray-600" />
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2 font-medium">(128 Reviews)</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
                ₹{product.price}
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {product.description || "A remarkably stunning product crafted with supreme attention to detail. Elevate your everyday life with this essential premium item designed just for you."}
              </p>

              {product.sizes?.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Select size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[3rem] px-4 py-3 rounded-2xl text-sm font-black transition-all border-2 ${
                          selectedSize === sz
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-transparent hover:border-purple-400"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-2xl">
                  <FaShieldAlt className="text-xl" />
                  <span className="font-semibold text-sm">1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-2xl">
                  <FaTruck className="text-xl" />
                  <span className="font-semibold text-sm">Free Express Delivery</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addToCart}
                className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-lg font-bold rounded-full shadow-2xl hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-3"
              >
                <FaShoppingCart />
                Add to Cart Seamlessly
              </motion.button>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
