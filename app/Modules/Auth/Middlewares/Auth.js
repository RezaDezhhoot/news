const jwt = require("jsonwebtoken");

exports.authenticated = (req,res,next,guard='api') => {
    if (guard === 'api') {
        try {
            const authHeader = req.get('Authorization');
            if (! authHeader) {
                return res.status(401).json({data:{result:'unauthorized user'},message:'error'});
            }
            const token = authHeader.split(" ")[1];
            const decodedToken = jwt.verify(token , process.env.JWT_SECRET);
            if (! decodedToken) {
                return res.status(401).json({data:{result:'unauthorized user'},message:'error'});
            }
            req.userId = decodedToken.user._id;
            req.token = token;
            next();
        } catch (err) {
            return res.status(401).json({data:{result:'unauthorized user'},message:'error'});
        }
    } else {
        if (req.isAuthenticated()){
            return next();
        } else return res.redirect('/admin/auth/login');
    }
}