const jwt = require("jsonwebtoken");


function auth(req , res , next){
    const token = req.header("Authorization")?.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "Access Denied. No Token Provided"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // { id, iat, exp }
        next();
    } catch (err){
        res.status(401).json({ message: "Invalid Token" });
    }
}

module.exports = auth