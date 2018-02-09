const {Wit, log} = require('node-wit');

module.exports = function messageHandler(message, sender) {

    const client = new Wit({
        accessToken: process.env.WIT_AI_APP_TOKEN,
        logger: new log.Logger(log.DEBUG) // optional
    });

    return client.message(message.text, {});
};
