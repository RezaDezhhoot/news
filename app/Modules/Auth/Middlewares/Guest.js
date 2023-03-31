const jwt = require("jsonwebtoken");
exports.guest = (req,res,next,guard = 'api') => {
    if (guard === 'api') {
        try {
            const authHeader = req.get('Authorization');
            if (authHeader) {
                const token = authHeader.split(" ")[1];
                const decodedToken = jwt.verify(token , process.env.JWT_SECRET);
                if (decodedToken) {
                    return res.status(403).json({data:{result:'شما به این بخش دسترسی ندارید'},message:'error'});
                }
                return res.status(403).json({data:{result:'شما به این بخش دسترسی ندارید'},message:'error'});
            }
            next();
        } catch (err) {
            return res.status(401).json({data:{result:err},message:'error'});
        }
    } else {
        if (! req.isAuthenticated()){
            return next();
        } else return res.redirect('/admin');
    }
}