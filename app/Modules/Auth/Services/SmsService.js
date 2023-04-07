const {send} = require("./SMS/KavehNegarService");
module.exports.send = async ( receptor , code , template = 'verification') => {
    return await send(receptor,code,template);
}