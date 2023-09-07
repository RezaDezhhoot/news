const fetch =  require('node-fetch')

module.exports.send = async ( receptor , code , template = 'pirouzverification') => {
    const url = `https://api.kavenegar.com/v1/${process.env.KAVEH_NEGAR_API_KEY}/verify/lookup.json?receptor=${receptor}&template=${template}&token=${code}`;

    try {
        const response = await fetch(url,{
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded; charset:utf-8"
            }
        });
        const data = await response.json()
        console.log(data);
        return data.return.status;
    } catch (e) {
        return 500;
    }
}