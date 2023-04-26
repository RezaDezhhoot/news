module.exports.send = async ( receptor , code , template = 'pirouzverification') => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    return client.messages
        .create({
            body: `Pirooz\nYour code: ${code}`,
            from: process.env.TWILIO_FROM,
            to: '+' + receptor.substring(2)
        })
        .then(message => {
            return 200;
        }).catch(e => {
            console.log('twilio err',e);
            return 500;
        });
}