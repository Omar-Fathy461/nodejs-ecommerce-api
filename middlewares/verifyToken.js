const jwt = require('jsonwebtoken');
const appError = require("../utils/appError");
const { FAIL } = require("../utils/statusTypes");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    
    if(!authHeader) return next(appError.create("Token is required", 401, FAIL));

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.decoded = decoded;
        next();
    } catch (err) {
        const error = appError.create('Invalid Token', 401, FAIL);
        return next(error);
    };
};

module.exports = verifyToken