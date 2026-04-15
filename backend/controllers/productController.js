const Product = require("../models/Product.js");

function parseSizesFromBody(body) {
  if (!body || body.sizes == null || body.sizes === "") return [];
  try {
    const raw = typeof body.sizes === "string" ? JSON.parse(body.sizes) : body.sizes;
    if (!Array.isArray(raw)) return [];
    return [...new Set(raw.map((s) => String(s).trim()).filter(Boolean))];
  } catch {
    return [];
  }
}

exports.addProduct = async (req,res)=>{
  try {
    const {name,price,category,subcategory,description} = req.body;
    const sizes = parseSizesFromBody(req.body);
    const gender = ["Men", "Women"].includes(req.body.gender) ? req.body.gender : undefined;

    if(!name ||  !price || !category || !subcategory || !description){
      return res.status(400).json({message:"All fields are required"})
    }
    const product = await Product.create({
      name,
      price,
      category,
      subcategory,
      description,
      sizes,
      gender,
      image: req.file? req.file.path : null  // if file is uploaded then store path else null
    });

    res.json({message:"Product added successfully",product});
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search, category, subcategory, minPrice, maxPrice, gender, size, page = 1, limit = 5 } = req.query;
    let query = {};

    // Global Search across name, category, subcategory, description, and gender
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { subcategory: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { gender: { $regex: search, $options: "i" } }
      ];
    }

    // Specific Category & Subcategory filters (Case-insensitive)
    if (category) query.category = { $regex: `^${category}$`, $options: "i" };
    if (subcategory) query.subcategory = { $regex: `^${subcategory}$`, $options: "i" };

    if (gender && ["Men", "Women"].includes(gender)) {
      query.gender = { $regex: `^${gender}$`, $options: "i" };
    }

    if (size) {
      const sizeTrim = String(size).trim();
      if (sizeTrim) query.sizes = sizeTrim;
    }

    // Price filtering logic
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Pagination setup
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    // Fetch products and total count
    const products = await Product.find(query).skip(skip).limit(limitNum);
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

