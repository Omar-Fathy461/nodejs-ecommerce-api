const appError = require("../utils/appError")
const { ERROR } = require("../utils/statusTypes")

const protectRoute = () => {
    return (req, res, next) => {
        if(req.decoded.isAdmin === false){
            return next(appError.create(`This user is not authorized`, 401, ERROR))
        };
        next();
    };
};

module.exports = protectRoute;