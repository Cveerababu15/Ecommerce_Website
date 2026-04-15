const mongoose=require("mongoose");
const ProductSchema=new mongoose.Schema({
    name:{type:String,required:true},
    price:Number,
    image:String,
    category:String,
    subcategory:String,
    description:String,
    /** Shirt / apparel sizes offered for this SKU (e.g. S, M, L, XL, XXL) */
    sizes:{type:[String],default:[]},
    /** Men's or women's line (optional for non-apparel) */
    gender:{type:String},

})
module.exports=mongoose.model("Product",ProductSchema)