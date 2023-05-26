const RoleConst = require('../../../Base/Constants/Role');

exports.admin = (req,res,next,guard = 'admin') => {
    if (req.isAuthenticated() && (req.user.role === RoleConst.ADMIN || req.user.role === RoleConst.ADMINSTRATOR)){
        return next();
    }
    if (guard === 'api' || req.header('accept') === 'application/json')
        return res.status(403).json({message: res.__('general.unauthorized')});

    else return res.redirect('/admin/auth/login');

}