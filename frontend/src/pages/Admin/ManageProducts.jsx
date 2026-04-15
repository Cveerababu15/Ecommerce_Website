import { useEffect, useState } from "react";
import { productAPI } from "../../services/api";
import { motion } from "framer-motion";
import { FaTrash, FaBox, FaSearch, FaTag, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getAllAdmin(); 
      setProducts(res.data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if(window.confirm("Are you brutally sure you want to delete this product?")) {
      try {
        await productAPI.delete(id);
        fetchProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto w-full pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <FaBox className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Manage Inventory
            </h1>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">{products.length} Items Available </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white shadow-sm w-full md:w-64 transition-all font-bold"
            />
          </div>
          <Link to="/admin/add-product">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 h-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:shadow-purple-500/20 transition-all whitespace-nowrap"
            >
              <FaPlus /> <span className="hidden sm:inline">Add New</span>
            </motion.button>
          </Link>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-3 mb-10 pb-4 hide-scrollbar">
        {categories.map((cat, i) => (
          <button 
            key={i}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${
              activeCategory === cat 
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-md transform scale-105" 
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 shadow-xl"></div>
        </div>
      ) : products.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <FaBox className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-2xl font-bold dark:text-white">No products available in inventory.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={p._id} 
              className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group transition-all"
            >
              <div className="relative h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <img src={p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1740&auto=format"} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 shadow-sm">
                    <FaTag className="text-purple-500" /> {p.category || 'Item'}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-extrabold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2">{p.name}</h3>
                {(p.gender || (p.sizes && p.sizes.length > 0)) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.gender && (
                      <span className="text-xs font-black px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                        {p.gender}
                      </span>
                    )}
                    {p.sizes?.length > 0 && (
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                        {p.sizes.join(" · ")}
                      </span>
                    )}
                  </div>
                )}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">₹{p.price}</p>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteProduct(p._id)}
                    className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm group/btn"
                    title="Delete Product"
                  >
                    <FaTrash className="group-hover/btn:animate-pulse" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageProducts;