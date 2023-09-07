const Redis = require("../../../../Libraries/Redis");
const {redis_flush} = require("../../../../../utils/helpers");
module.exports.flush = async(req ,res) => {
    await redis_flush();

    const backURL = req.header('Referer') || '/';

    res.redirect(backURL);
}