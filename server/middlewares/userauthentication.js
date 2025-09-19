import jwt from "jsonwebtoken";



const userauth =async(req ,res ,next)=>{
    const{token} =req.cookies;  


    if(!token){
        return res.status(401).json({success :false , message:'Not Authorised, login again'})
    }
    try {
       const decodedtoken = jwt.verify(token,process.env.JWT_SECRET);

       if(!decodedtoken || !decodedtoken.id){
        return res.status(401).json({ success: false, message: "Unauthorized. Invalid token." });
    }
        req.body.userID = decodedtoken.id
         next();

        
    }
    
    catch (error) {
        return res.status(401).json({success :false , message:error.message})
    }
};



export default userauth;