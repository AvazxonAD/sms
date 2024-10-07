const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/asyncHandler.js');
const ErrorResponse = require('../utils/errorResponse.js');
const { getUserById } = require('../service/users.service.js');

module.exports = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('Token notog\'ri jonatildi', 403));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentTimestamp = Math.floor(Date.now() / 1000); // Joriy vaqt
    if (decoded.exp && decoded.exp < currentTimestamp) {
        return next(new ErrorResponse("Token muddati tugagan", 403));
    }

    const user = await getUserById(decoded.id)
    if (!user) {
        return next(new ErrorResponse("Siz tizimga kirmagansiz", 403));
    }

    req.user = user;

    next();
});
