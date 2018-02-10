const {Wit, log} = require('node-wit');

function about() {
    return "I am a Facebook Chatbot. Anders Weijnitz built me in February 2018. For natural language processing, I am using wit.ai.";
}

function lookupPersonFact(personName) {
    return "Looking up " + personName + "!";
}

function generatePersonFactReply(replyObj) {

    if(replyObj.value === "yourself")
        return about();
    else if (replyObj.confidence > 0.85)
        return lookupPersonFact(replyObj.value);
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
