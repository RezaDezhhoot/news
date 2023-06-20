const redis = require('redis');

console.log(process.env.REDIS_URL);

const client = redis.createClient({
    url: process.env.REDIS_URL
})

module.exports = client;