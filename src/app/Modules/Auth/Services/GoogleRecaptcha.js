const fetch =  require('node-fetch')

module.exports.verify = async (req) => {
    const secret_key = process.env.RECAPTCHA_SECRET_KEY;
    const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
    const response = await fetch(verifyURL,{
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset:utf-8"
        }
    });
    return await response.json();
}