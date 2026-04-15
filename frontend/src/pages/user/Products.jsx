import { useEffect, useState } from "react";
import { productAPI, cartAPI, categoryAPI } from "../../services/api";
import ProductCard from "../../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { FaFilter, FaTimes, FaSearch, FaChevronDown, FaTag } from "react-icons/fa";

function Products() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  
  // Real-time dynamic filter data directly from database
  const [filterData, setFilterData] = useState({ categories: [], subcategoriesMap: {} });
  
  // Active Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize Dynamic Filters Data
  useEffect(() => {
    categoryAPI.getAll().then(res => {
      const catsData = res.data || [];
      const uniqueCats = catsData.map(c => c.name);
      const subcatsMap = {};
      
      catsData.forEach(c => {
         subcatsMap[c.name] = c.subcategories || [];
      });
      
      setFilterData({ categories: uniqueCats, subcategoriesMap: subcatsMap });
    }).catch(err => console.error("Filter extraction failed", err));
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll({ 
        page, 
        search, 
        category, 
        subcategory, 
        minPrice, 
        maxPrice,
        gender,
        size
      });
      setProducts(res.data.products || []);
      setTotalPages(res.data.pages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, category, subcategory, minPrice, maxPrice, gender, size]);

  const { fetchCartCount } = useCart();

  const addToCart = async (product) => {
    try {
      if (product.sizes?.length) {
        toast.info("Choose a size on the product page to add this item.");
        return;
      }
      await cartAPI.addToCart({ productId: product._id, quantity: 1 });
      fetchCartCount();
      toast.success("Item beautifully added to your cart!");
    } catch (error) {
      toast.error("Please login to add to cart!");
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setSubcategory('');
    setMinPrice('');
    setMaxPrice('');
    setGender('');
    setSize('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12 font-sans overflow-x-hidden">
      
      {/* Eye Stunning Global Header */}
      <div className="w-full bg-gradient-to-br from-indigo-900 to-purple-800 dark:from-purple-900 dark:to-indigo-950 px-6 py-16 mb-8 relative flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 mix-blend-overlay rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 opacity-20 mix-blend-overlay rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            Discover Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Catalog</span>
          </h1>
          <p className="text-purple-200 text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto">Explore high-end fashion to modern electronics with real-time dynamic inventory filters.</p>
          
          <div className="relative max-w-2xl mx-auto shadow-2xl rounded-2xl overflow-hidden group">
            <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors text-xl" />
            <input
              type="text"
              placeholder="Search catalog by product name, details..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md pl-14 pr-6 py-5 focus:outline-none text-gray-900 dark:text-white font-bold text-lg"
            />
          </div>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 relative">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-2">
           <p className="text-gray-500 dark:text-gray-400 font-bold">{loading ? '...' : products.length} Items found</p>
           <button 
             onClick={() => setShowMobileFilters(true)}
             className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 font-bold dark:text-white hover:bg-gray-50 transition"
           >
             <FaFilter /> Filters
           </button>
        </div>

        {/* Sidebar Filters */}
        <AnimatePresence>
          {(showMobileFilters || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
            <>
              {/* Mobile Overlay */}
              <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
                 onClick={() => setShowMobileFilters(false)}
              />
              
              <motion.aside 
                initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -400 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed lg:sticky top-0 lg:top-24 left-0 h-screen lg:h-[calc(100vh-140px)] w-[85vw] max-w-[320px] lg:w-[320px] bg-white dark:bg-gray-900 shadow-2xl lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-r-3xl lg:rounded-3xl border border-gray-100 dark:border-gray-800 z-[70] lg:z-10 flex flex-col overflow-hidden`}
              >
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                   <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2"><FaFilter className="text-purple-500" /> Advanced Filters</h2>
                   <button onClick={() => setShowMobileFilters(false)} className="lg:hidden p-2 text-gray-500 hover:text-rose-500"><FaTimes size={20}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                   {/* Real-time Category Check */}
                   <div>
                     <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Live Categories</h3>
                     <div className="space-y-2">
                       <button 
                         onClick={() => { setCategory(""); setSubcategory(""); setPage(1); }}
                         className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${category === "" ? "bg-purple-600 text-white shadow-md shadow-purple-500/30" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                       >
                         All
                       </button>
                       {filterData.categories.map((cat, i) => (
                         <div key={i} className="flex flex-col gap-1">
                           <button 
                             onClick={() => { setCategory(cat); setSubcategory(""); setPage(1); }}
                             className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${category === cat ? "bg-purple-600 text-white shadow-md shadow-purple-500/30" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"}`}
                           >
                             {cat}
                           </button>
                           {/* Real-time Subcategories Indented */}
                           <AnimatePresence>
                             {category === cat && filterData.subcategoriesMap[cat]?.length > 0 && (
                               <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ml-4 space-y-1 mt-1 overflow-hidden">
                                 {filterData.subcategoriesMap[cat].map((sub, j) => (
                                   <button 
                                     key={j}
                                     onClick={() => { setSubcategory(sub); setPage(1); }}
                                     className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${subcategory === sub ? "bg-indigo-500 text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400"}`}
                                   >
                                     <FaChevronDown className="text-[10px] transform -rotate-90 opacity-50" /> {sub}
                                   </button>
                                 ))}
                               </motion.div>
                             )}
                           </AnimatePresence>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Gender & size (apparel) */}
                   <div>
                     <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Apparel</h3>
                     <div className="space-y-3">
                       <select
                         value={gender}
                         onChange={(e) => { setGender(e.target.value); setPage(1); }}
                         className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 dark:text-white font-bold"
                       >
                         <option value="">All genders</option>
                         <option value="Men">Men</option>
                         <option value="Women">Women</option>
                       </select>
                       <select
                         value={size}
                         onChange={(e) => { setSize(e.target.value); setPage(1); }}
                         className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 dark:text-white font-bold"
                       >
                         <option value="">Any size</option>
                         {["S", "M", "L", "XL", "XXL"].map((sz) => (
                           <option key={sz} value={sz}>Size {sz}</option>
                         ))}
                       </select>
                     </div>
                   </div>

                   {/* Price Tracking Array */}
                   <div>
                     <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Price Range (₹)</h3>
                     <div className="flex gap-4 items-center">
                       <input 
                         type="number" 
                         placeholder="Min" 
                         value={minPrice}
                         onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                         className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 dark:text-white font-mono font-bold"
                       />
                       <span className="text-gray-400 font-black">-</span>
                       <input 
                         type="number" 
                         placeholder="Max" 
                         value={maxPrice}
                         onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                         className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 dark:text-white font-mono font-bold"
                       />
                     </div>
                     {(minPrice || maxPrice) && <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-bold animate-pulse">Filtering range continuously applying</p>}
                   </div>

                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <button onClick={() => { resetFilters(); setShowMobileFilters(false); }} className="w-full py-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    Reset Filter Tracking
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid Area */}
        <div className="flex-1 w-full lg:w-auto min-h-[500px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900/50 border-t-purple-600 dark:border-t-purple-400 animate-spin"></div>
                <div className="absolute inset-4 rounded-full border-4 border-indigo-200 dark:border-indigo-900/50 border-b-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
            </div>
          ) : products.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-32 bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 px-6">
              <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-inner">
                 <FaSearch className="text-4xl text-gray-300 dark:text-gray-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Zero matches found</h2>
              <p className="text-gray-500 font-medium max-w-md mx-auto">Try expanding your price range, clearing your search query, or selecting "Everything" in your left filter column.</p>
              <button 
                onClick={resetFilters}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 dark:from-purple-900/40 dark:to-indigo-900/40 dark:text-purple-300 rounded-xl font-bold hover:shadow-lg transition-all border border-purple-200 dark:border-purple-800"
              >
                Clear all active filters
              </button>
            </motion.div>
          ) : (
             <div className="space-y-6">
               <div className="hidden lg:flex items-center justify-between bg-white dark:bg-gray-900 px-8 py-5 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wide">
                    Extracted <span className="text-gray-900 dark:text-white font-black text-lg">{products.length}</span> verified stunning items
                    {(category || subcategory || gender || size) && (
                      <span className="ml-2">
                        {category || subcategory ? (
                          <>inside <span className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-lg ml-1">{subcategory || category}</span></>
                        ) : null}
                        {gender && <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-black">{gender}</span>}
                        {size && <span className="ml-2 text-gray-600 dark:text-gray-300 font-black">size {size}</span>}
                      </span>
                    )}
                  </p>
               </div>

                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                >
                  {products.map((p, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={p._id}
                    >
                      <ProductCard product={p} addToCart={addToCart} />
                    </motion.div>
                  ))}
                </motion.div>
             </div>
          )}

          {/* Precision Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center mt-16 mb-8 gap-3">
              <button
                onClick={() => { setPage((p) => Math.max(p - 1, 1)); window.scrollTo({top: 0}); }}
                disabled={page === 1}
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-xl font-black shadow-sm disabled:opacity-40 disabled:scale-100 hover:scale-105 active:scale-95 transition-all"
              >
                PREV
              </button>
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-2 shadow-inner h-12 hidden sm:flex">
                 {Array.from({ length: totalPages }).map((_, i) => (
                   <button 
                     key={i}
                     onClick={() => { setPage(i + 1); window.scrollTo({top: 0}); }}
                     className={`w-10 h-10 m-1 rounded-lg font-black transition-all ${page === i + 1 ? "bg-purple-600 text-white shadow-md shadow-purple-500/40" : "text-gray-500 hover:bg-white dark:hover:bg-gray-700"}`}
                   >
                     {i + 1}
                   </button>
                 ))}
              </div>
              <button
                onClick={() => { setPage((p) => Math.min(p + 1, totalPages)); window.scrollTo({top: 0}); }}
                disabled={page === totalPages}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-transparent rounded-xl font-black shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:scale-100 hover:scale-105 active:scale-95 transition-all"
              >
                NEXT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;