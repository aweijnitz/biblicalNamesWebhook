//const appConf = require('../conf/appConfig.json');
const os = require('os');
const util = require('util');
const fs = require('fs');


/**
 * Private helper to sanity check a string before using it.
 * @param str
 * @returns {boolean}
 */
const isDefined = function (str) {
    return (typeof str != 'undefined' && null != str && '' != str);
};

function firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

function handleMessage(message) {
    // check greeting is here and is confident
    const greeting = firstEntity(message.nlp, 'greetings');
    if (greeting && greeting.confidence > 0.8) {
        return 'Hi there!';
    } else {
        return 'Default reply :-)';
    }
}


/**
 * Public. Generate QR Code with given content and stream back to client.
 * @param req
 * @param res
 */
const handleReq = function (appConf, log4js) {
    const logger = log4js.getLogger("messageHandler");

    return function webhook(req, res) {
        let body = req.body;

        //logger.info(util.inspect(req.body));

        // Checks this is an event from a page subscription
        if (body.object === 'page') {
            res.status(200);
            // Iterates over each entry - there may be multiple if batched
            body.entry.forEach(function (entry) {

                    // Gets the message. entry.messaging is an array, but
                    // will only ever contain one message, so we get index 0
                    let webhook_event = entry.messaging[0];
                    logger.debug(webhook_event);

                    if (!!webhook_event.message) {

                        if (!!webhook_event.message.nlp) {
                            let nlp = webhook_event.message.nlp;
                            logger.debug(util.inspect(nlp, {showHidden: false, depth: 5, colors: true}));
                        }

                        let reply = handleMessage(webhook_event.message);
                        logger.debug('REPLY - ' + reply);
                        res.send(reply);
                    }
                }
            );

            // Returns a '200 OK' response to all requests
            res.send('EVENT_RECEIVED');
        } else {
            // Returns a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }
        res.end();
    };
};

module.exports = handleReq;
