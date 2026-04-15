const multer=require("multer");
const {CloudinaryStorage}=require("multer-storage-cloudinary");
const cloudinary=require("./cloudinary.js")
const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"uploads",
        allowed_formats:["jpg","png","jpeg","gif","webp"]
    }
})
const upload=multer({storage})
module.exports=upload