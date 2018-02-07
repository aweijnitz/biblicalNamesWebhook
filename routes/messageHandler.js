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

            // Iterates over each entry - there may be multiple if batched
            body.entry.forEach(function (entry) {

                // Gets the message. entry.messaging is an array, but
                // will only ever contain one message, so we get index 0
                let webhook_event = entry.messaging[0];
                logger.debug(webhook_event);

		let nlp = webhook_event.message.nlp;
		logger.debug(util.inspect(nlp, { showHidden: false, depth: 5, colors: true }));
            });

            // Returns a '200 OK' response to all requests
            res.status(200).send('EVENT_RECEIVED');
        } else {
            // Returns a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }
    };
};

module.exports = handleReq;
