exports.ApiHeaders = (req, res, next) => {
    const userAgent = req.useragent;
    if (userAgent.isMobile || (userAgent.isBot === 'postman' && process.env.MODE === 'development') ) {
        return next();
    } else {
        return res.status(400).json({});
    }
}

exports.AdminHeaders = (req, res, next) => {
    const userAgent = req.useragent;
    if ((userAgent.isFirefox || userAgent.isSafari || userAgent.isChromeOS || userAgent.isChrome)
        && ! userAgent.isBot ) {
        return next();
    } else {
        return res.status(400).json({});
    }
}