exports.admin = (req,res,next) => {
    if (req.isAuthenticated() && req.user.role === "admin"){
        return next();
    }

    return res.status(403).json({data:{result:'unauthorized admin'},message:'error'});

}