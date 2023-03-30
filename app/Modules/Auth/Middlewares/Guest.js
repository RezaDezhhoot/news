exports.guest = (req,res,next) => {
    if (!req.isAuthenticated()){
        return next();
    }

    return res.status(403).json({data:{result:'شما به این بخش دسترسی ندارید'},message:'error'});
}