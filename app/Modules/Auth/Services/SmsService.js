const KavehNegarService = require("./SMS/KavehNegarService");
const TwilioService = require("./SMS/TwilioService");

module.exports.send = async ( receptor , code , template = 'pirouzverification') => {
    if (process.env.MODE === 'test' || process.env.MODE === 'development')
        return 200;

    if (receptor.startsWith('0098')) {
        return await KavehNegarService.send(receptor,code,template);
    } else {
        return await TwilioService.send(receptor,code,template);
    }
}