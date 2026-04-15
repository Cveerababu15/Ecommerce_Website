const Category = require("../models/Category");

exports.createCategory = async (req,res)=>{
  const {name, subcategories} = req.body;

  const category = await Category.create({
    name,
    subcategories
  });

  res.json(category);
};

exports.getCategories = async (req,res)=>{
  const categories = await Category.find();
  res.json(categories);
};