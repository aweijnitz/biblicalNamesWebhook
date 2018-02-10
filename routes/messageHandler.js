const path = require('path');
const fs = require('fs');
const {Wit, log} = require('node-wit');
const FACTS_FILE = path.resolve('./conf/generated-nameFacts.json');
const SEARCH_INDEX_FILE = path.resolve('./conf/generated-searchIndex.json');

const fulltextsearchlight = require('full-text-search-light');
const facts = fs.readFileSync(FACTS_FILE);
const searchIndex = fulltextsearchlight.loadSync(SEARCH_INDEX_FILE);

function about() {
    return "I am a Facebook Chatbot. Anders Weijnitz built me in February 2018. For natural language processing, I rely on wit.ai.";
}

function lookupPersonFact(personName = '') {
    let reply = 'I am sorry, I could not find anything about ' + personName + '. :-( '
        + 'Are you sure it is a biblical name, from the Old Testament?';

    if (personName.length <= 2)
        return ':-( Please specify a name with more than two letters in it.';

    let results = searchIndex.search(personName);

    if (results.length === 0) {

        results = searchIndex.search(personName.substr(0, 2));
        if (results.length > 0) {
            let persons = '';
            results.forEach((name) => {
                persons += name + ' ';
            });
            reply = 'I found more than one. Did you mean one of these? ' + persons;
        } else
            reply = 'I am sorry. There is no one named ' + personName + ' in the Old Testament that I know of. :-/';

    } else if (results.length === 1) {
        let fact = facts.find(entry => {
            console.log('Checking ' + personName + ' against ' + JSON.stringify(entry));
            return entry[personName] !== undefined;
        });

        console.log("REPLYING: " + fact);
        reply = '' + fact;

    } else if (results.length > 1 && results.length <= 5) {

        let persons = '';
        results.forEach((name) => {
            persons += name + ' ';
        });
        reply = 'I found more than one. Did you mean one of these? ' + persons;
    } else if (results.length > 5) {

        reply = 'I found too many matches (' + results.length + ')! Could you please be more specific?';
    }
    return reply;
}

function generatePersonFactReply(replyObj) {

    if (replyObj.value === "yourself")
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
