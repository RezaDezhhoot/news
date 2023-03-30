exports.admin = (req,res,next,guard = 'api') => {
    if (req.isAuthenticated() && req.user.role === "admin"){
        return next();
    }
    if (guard === 'api')
        return res.status(403).json({data:{result:'unauthorized admin'},message:'error'});
    else return res.redirect('/admin/auth/login');

}