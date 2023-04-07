const {send} = require("./SMS/KavehNegarService");
module.exports.send = async ( receptor , code , template = 'verification') => {
    if (process.env.MODE === 'test')
        return 200;

    return await send(receptor,code,template);
}