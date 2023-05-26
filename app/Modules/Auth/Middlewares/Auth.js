const jwt = require("jsonwebtoken");

exports.authenticated = (req,res,next,guard='api') => {
    if (guard === 'api' || req.header('accept') === 'application/json') {
        try {
            const authHeader = req.get('Authorization');
            if (! authHeader) {
                return res.status(401).json({message: res.__('general.unauthorized')});
            }
            const token = authHeader.split(" ")[1];
            const decodedToken = jwt.verify(token , process.env.JWT_SECRET);
            if (! decodedToken) {
                return res.status(401).json({message: res.__('general.unauthorized')});
            }
            req.userId = decodedToken.user._id;
            req.token = token;
            next();
        } catch (err) {
            return res.status(401).json({message: res.__('general.unauthorized')});
        }
    } else {
        if (req.isAuthenticated()){
            return next();
        } else return res.redirect('/admin/auth/login');
    }
}