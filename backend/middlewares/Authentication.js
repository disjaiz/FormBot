// Authentication Middleware: Ensure the user is logged in by validating their session or token.
const jwt  = require("jsonwebtoken");
const authenticate = (req, res, next) => {
     const token = req.cookies.Token;
        // console.log("token", token);
      
        if(!token){
            return res.status(401).json({err: "You are not logged in. Token missing!"});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        // console.log("decoded", decoded); 
      
        next();
  };

module.exports =  authenticate;
  