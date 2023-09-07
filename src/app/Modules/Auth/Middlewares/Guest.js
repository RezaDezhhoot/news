const jwt = require("jsonwebtoken");
exports.guest = (req,res,next,guard = 'api') => {
    if (guard === 'api' || req.header('accept') === 'application/json') {
        try {
            const authHeader = req.get('Authorization');
            if (authHeader) {
                const token = authHeader.split(" ")[1];
                const decodedToken = jwt.verify(token , process.env.JWT_SECRET);
                if (decodedToken) {
                    return res.status(403).json({message:res.__('general.access_denied')});
                }
            }
            next();
        } catch (message) {
            return res.status(401).json({message});
        }
    } else {
        if (! req.isAuthenticated()){
            return next();
        } else return res.redirect('/admin');
    }
}