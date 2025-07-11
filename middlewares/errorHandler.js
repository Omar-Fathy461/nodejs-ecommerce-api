module.exports = (routeHandlerFn) => {
    return (req, res, next) => {
        routeHandlerFn(req, res, next).catch(error => next(error));
    };
};