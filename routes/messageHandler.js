const {Wit, log} = require('node-wit');


function generatePersonFactReply(replyObj) {
    if (replyObj.confidence > 0.85)
        return replyObj.value;
    else
        return ":-/ I am not sure I understood correctly. Did you ask about " + replyObj.value + "?";
}

module.exports = async function messageHandler(message, sender) {

    const client = new Wit({
        accessToken: process.env.WIT_AI_APP_TOKEN,
        logger: new log.Logger(log.DEBUG) // optional
    });

    let replyObj = await client.message(message.text, {});

    return generatePersonFactReply(replyObj.entities.contact[0]);
};
