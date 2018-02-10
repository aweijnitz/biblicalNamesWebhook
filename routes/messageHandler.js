const path = require('path');
const fs = require('fs');
const {Wit, log} = require('node-wit');
const FACTS_FILE = path.resolve('./conf/generated-nameFacts.json');
const SEARCH_INDEX_FILE = path.resolve('./conf/generated-searchIndex.json');

const fulltextsearchlight = require('full-text-search-light');
const facts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));
const searchIndex = fulltextsearchlight.loadSync(SEARCH_INDEX_FILE);
const has = require('lodash.has');


function isGreeting(messsage) {
    return has(messsage, 'nlp.entities.greetings');
}

function isListCommand(message) {
    return message.text === 'list' || message.text === 'List' || message.text === 'LIST';
}

function isHelpCommand(message) {
    return message.text === 'help' || message.text === 'Help' || message.text === 'HELP' || message.text === '?';
}

function helpText() {
    return 'Ask me about anyone in the Old Testament! For example, "Tell me about Ruth". Type "list" for a list of names that I know of.'
}

function about() {
    return "I am a Facebook Chatbot. Anders Weijnitz built me in February 2018. For natural language processing, I rely on wit.ai.";
}

function listNames() {
    let names = '';
    facts.forEach(fact => {
        names += fact.field1 + ' ';
    });
    return names;
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
            reply = 'Not sure who you mean. Did you mean one of these? ' + persons;
        } else
            reply = 'I am sorry. There is no one named ' + personName + ' in the Old Testament that I know of. :-/';

    } else if (results.length === 1) {
        let fact = facts.find(entry => {
            //console.log('Checking ' + personName + ' against ' + JSON.stringify(entry));
            return entry[personName] !== undefined;
        });

        console.log("REPLYING: " + fact[personName]);
        reply = '' + fact[personName];

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

    if(isGreeting(message)) {
        return 'Hello ' + sender.first_name + '! ' + helpText();

    } else if(isListCommand(message)) {
        return 'Ok, these are the names I know of: ' + listNames();

    } else if(isHelpCommand(message)) {
        return helpText();

    } else {
        const client = new Wit({
            accessToken: process.env.WIT_AI_APP_TOKEN,
            logger: new log.Logger(log.DEBUG) // optional
        });

        let replyObj = await client.message(message.text, {});

        return generatePersonFactReply(replyObj.entities.contact[0]);
    }


};
