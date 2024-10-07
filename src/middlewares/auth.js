const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse.js");
const pool = require("../config/db.js");
const { errorCatch } = require("../utils/errorCtach.js");

module.exports = async (req, res, next) => {
    try {
        let token;
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
        ) {
          token = req.headers.authorization.split(" ")[1];
        }
      
        if (!token) {
          throw new ErrorResponse("Token notog'ri jonatildi", 403)
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
        if (!decoded) {
          throw new ErrorResponse("Siz tizimga kirmagansiz", 403)
        }
      
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTimestamp) {
          throw new ErrorResponse("Token muddati tugagan", 403)
        }
      
        if (!decoded) {
          throw new ErrorResponse("User topilmadi", 404)
        }
        req.user = decoded;
        next();
    } catch (error) {
        errorCatch(error, res)
    }
}