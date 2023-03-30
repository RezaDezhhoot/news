exports.guest = (req,res,next) => {
    if (!req.isAuthenticated()){
        return next();
    }

    return next();
}