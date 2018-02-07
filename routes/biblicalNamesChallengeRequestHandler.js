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
const handleReq = function(appConf, log4js) {
    const logger = log4js.getLogger("biblicalNameHook");
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;


    return function webhook (req, res) {
        //const url = 'http://' + (req.query.url || 'no-url-defined');
        // Parse params from the webhook verification request
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        // Check if a token and mode were sent
        if (mode && token) {

            // Check the mode and token sent are correct
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {

                // Respond with 200 OK and challenge token from the request
                logger.info('WEBHOOK_VERIFIED');
                res.status(200).send(challenge).end();

            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
        //res.json({ msg: 'Hello World!' }).end();
    };
};

module.exports = handleReq;
