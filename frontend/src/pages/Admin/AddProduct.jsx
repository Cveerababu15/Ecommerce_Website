import { useState, useEffect } from "react";
import { productAPI, categoryAPI } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { motion } from "framer-motion";
import { FaPlusCircle, FaTag, FaAlignLeft, FaRupeeSign, FaBox, FaUpload, FaTshirt } from "react-icons/fa";

const SHIRT_SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

function AddProduct() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    description: "",
    image: null,
    gender: "",
    sizes: []
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    categoryAPI.getAll().then(res => {
      setCategories(res.data || []);
    }).catch(err => console.error(err));
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setForm({...form, category: selectedCategory, subcategory: ""});
    const found = categories.find(c => c.name === selectedCategory);
    setSubcategories(found ? found.subcategories : []);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const toggleSize = (sz) => {
    setForm((f) => {
      const next = f.sizes.includes(sz) ? f.sizes.filter((s) => s !== sz) : [...f.sizes, sz];
      const order = (a, b) => SHIRT_SIZE_OPTIONS.indexOf(a) - SHIRT_SIZE_OPTIONS.indexOf(b);
      return { ...f, sizes: [...next].sort(order) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("subcategory", form.subcategory);
      data.append("description", form.description);
      data.append("sizes", JSON.stringify(form.sizes));
      if (form.gender === "Men" || form.gender === "Women") {
        data.append("gender", form.gender);
      }
      if (form.image) data.append("image", form.image);
      await productAPI.create(data);
      toast.success("Product successfully launched!");
      setForm({ name: "", price: "", category: "", subcategory: "", description: "", image: null, gender: "", sizes: [] });
      setPreview(null);
    } catch (error) {
      toast.error("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <FaPlusCircle className="text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Add New Product</h1>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">Expand your inventory with stunning new items</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-12"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Left Column - Image Upload */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Product Image</label>
              <div className="relative group w-full aspect-square rounded-[2rem] border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center overflow-hidden hover:border-purple-500 dark:hover:border-purple-400 transition-colors cursor-pointer">
                <input 
                   type="file" 
                   onChange={handleImageChange} 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                   required
                />
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover z-10" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 dark:text-gray-500 group-hover:text-purple-500 transition-colors z-10 relative pointer-events-none">
                    <FaUpload className="text-4xl mb-4" />
                    <span className="font-bold text-center px-4">Click or drag image here</span>
                  </div>
                )}
                {/* Overlay on hover */}
                {preview && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <span className="text-white font-bold bg-purple-600 px-4 py-2 rounded-full">Change Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Inputs */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"><FaBox className="text-purple-500" /> Product Name</label>
              <input value={form.name} required onChange={e => setForm({...form, name:e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-bold transition-all" placeholder="e.g., Premium Wireless Headphones" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"><FaRupeeSign className="text-purple-500" /> Price (₹)</label>
                <input value={form.price} type="number" required onChange={e => setForm({...form, price:e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-bold transition-all" placeholder="99.99" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"><FaTag className="text-purple-500" /> Category</label>
                <select value={form.category} required onChange={handleCategoryChange} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-bold transition-all appearance-none cursor-pointer">
                  <option value="" disabled>Select Category</option>
                   {categories.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                   ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"><FaTag className="text-purple-500 opacity-70" /> Subcategory</label>
              <select value={form.subcategory} required={subcategories.length > 0} onChange={e => setForm({...form, subcategory:e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-bold transition-all appearance-none cursor-pointer disabled:opacity-50" disabled={subcategories.length === 0}>
                <option value="" disabled>Select Subcategory</option>
                {subcategories.map((s, i) => (
                   <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"><FaTshirt className="text-purple-500" /> Apparel: gender &amp; sizes</label>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">For shirts and similar items, set who it is for and which sizes are in stock.</p>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-5 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-bold transition-all appearance-none cursor-pointer"
              >
                <option value="">Gender (optional)</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
              <div className="flex flex-wrap gap-2">
                {SHIRT_SIZE_OPTIONS.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-4 py-2 rounded-xl text-sm font-black transition-all border-2 ${
                      form.sizes.includes(sz)
                        ? "bg-purple-600 text-white border-purple-600 shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"><FaAlignLeft className="text-purple-500" /> Description</label>
              <textarea value={form.description} required onChange={e => setForm({...form, description:e.target.value})} rows="4" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-bold transition-all resize-none" placeholder="Provide a detailed engaging description of the product..." />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit" 
              className={`w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl flex items-center justify-center gap-3 transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-purple-500/40'}`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                <><FaPlusCircle /> Launch Product</>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddProduct;