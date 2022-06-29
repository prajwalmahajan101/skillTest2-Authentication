const kue = require('kue')


const queue = kue.createQueue({
    prefix: 'q',
    redis: {
        port: process.env.redisPort,
        host:process.env.redisServer,
        auth: process.env.redisPass,
    }
});

module.exports = queue