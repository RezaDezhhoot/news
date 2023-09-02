module.exports = (req, res, next) => {
    let local = 'en';
    if (req.query.lang) {
        local = req.query.lang;
        res.cookie('lang', local, { maxAge: 3600000, httpOnly: true });
    } else if (req.cookies.lang) {
        local = req.cookies.lang;
    }
    res.setLocale(local);
    req.setLocale(local);
    next();
}