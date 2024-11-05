 const jwt = require('jsonwebtoken');
 let validateAdmin = (req,res,next)=>{
    let token = req.cookies.token;
  try{
    if(!token) return res.status(401).send("Access denied. No token provided.");
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if(err) return res.status(401).send("Access denied. Invalid token.");
        req.admin = decoded;
        next();
    });
  }
  catch(err){
    res.status(401).send("Unauthorized");
    return;
  }
 }

 module.exports = validateAdmin;