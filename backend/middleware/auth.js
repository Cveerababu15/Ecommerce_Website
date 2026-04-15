const jwt=require("jsonwebtoken")
exports.auth=(req,res,next)=>{
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }
    
    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
        req.user=decoded
        next()
    }catch(err){
        return res.status(401).json({message:"Invalid token"})
    }
}

exports.admin=(req,res,next)=>{
    if(req.user.role!=="admin"){
        return res.status(403).json({message:"Admin only"})
    }
    next()
}