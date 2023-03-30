exports.authenticated = (req,res,next) => {
    if (req.isAuthenticated()){
        return next();
    }

    return res.status(401).json({data:{result:'unauthorized user'},message:'error'});
}