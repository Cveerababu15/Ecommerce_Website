const Cart=require("../models/Cart.js")
const Product=require("../models/Product.js")

function normalizeSize(s) {
    if (s == null || s === "") return null;
    return String(s).trim();
}

exports.addToCart=async(req,res)=>{
    try {
        const userId=req.user.id;
        const {productId,quantity}=req.body;
        const sizeNorm = normalizeSize(req.body.size);

        if(!productId || !quantity){
            return res.status(400).json({message:"Product ID and quantity are required"})
        }

        const productDoc = await Product.findById(productId);
        if (!productDoc) {
            return res.status(404).json({ message: "Product not found" });
        }

        const offered = Array.isArray(productDoc.sizes) ? productDoc.sizes : [];
        if (offered.length > 0) {
            if (!sizeNorm || !offered.includes(sizeNorm)) {
                return res.status(400).json({ message: "Valid size is required for this product" });
            }
        } else if (sizeNorm) {
            return res.status(400).json({ message: "This product does not use sizes" });
        }

        const lineMatches = (p) =>
            p.productId.toString() === productId && normalizeSize(p.size) === sizeNorm;

        let cart=await Cart.findOne({  userId });
        if(!cart){
            cart=await Cart.create({
                userId,
                products:[{productId,quantity,size:sizeNorm}]
            })
        } else{
            const productIndex=cart.products.findIndex(lineMatches);
            if(productIndex>-1){
                cart.products[productIndex].quantity+=quantity;
                if (cart.products[productIndex].quantity <= 0) {
                    cart.products.splice(productIndex, 1);
                }
            } else{
                if (quantity > 0) {
                    cart.products.push({productId,quantity,size:sizeNorm})
                }
            }
            await cart.save();
        }
        
        res.status(200).json({success:true,message:"Item Added to cart",cart});
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({message: "Error adding to cart", error: error.message});
        
    }
}

exports.getCart=async(req,res)=>{
    try {
        const cart=await Cart.findOne({userId:req.user.id}).populate("products.productId","name price image sizes gender");
        res.status(200).json({success:true,cart});
        
    } catch (error) {
        console.error("Get Cart Error:", error);
        res.status(500).json({message: "Error fetching cart", error: error.message});
        
    }
}