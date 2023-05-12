const Redis = require("../../../../Libraries/Redis");
module.exports.flush = async(req ,res) => {
    await Redis.connect();

    await Redis.flushAll();

    await Redis.disconnect();

    const backURL = req.header('Referer') || '/';

    res.redirect(backURL);
}