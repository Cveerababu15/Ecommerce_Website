const mongoose=require("mongoose")
const CategorySchema=new mongoose.Schema({
    name:{type:String,required:true,},  //  Fashion
    subcategories:[String]  // ["Shirts""Pnats"]
})
module.exports=mongoose.model("Category",CategorySchema)
