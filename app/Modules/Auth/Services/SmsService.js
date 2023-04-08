const {send} = require("./SMS/KavehNegarService");
module.exports.send = async ( receptor , code , template = 'pirouzverification') => {
    if (process.env.MODE === 'test' || process.env.MODE === 'development')
        return 200;

    return await send(receptor,code,template);
}