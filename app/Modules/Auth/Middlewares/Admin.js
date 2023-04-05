const RoleConst = require('../../../Base/Constants/Role');

exports.admin = (req,res,next,guard = 'admin') => {
    if (req.isAuthenticated() && (req.user.role === RoleConst.ADMIN || req.user.role === RoleConst.ADMINSTRATOR)){
        return next();
    }
    if (guard === 'api')
        return res.status(403).json({data:{result:'unauthorized admin'},message:'error'});
    else return res.redirect('/admin/auth/login');

}