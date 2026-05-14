
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        //get the auth header from the request
        const authHeader = req.headers.authorization;

        //if there is no header then go no further
        if(!authHeader){
            return res.status(401).json({
                message: "No token provided",
            });
        }

        //the token will come in like "Bearer KJHGVBC8sa7djkdsa" so we need to check if it matches format
        const [ bearer, token ] = authHeader.split(" ");
        if(!token || bearer !== "Bearer"){
            return res.status(401).json({
                message: "Invalid token format",
            });
        }

        //take the token and verify it with jwt_secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: decoded.userId,
        };
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;