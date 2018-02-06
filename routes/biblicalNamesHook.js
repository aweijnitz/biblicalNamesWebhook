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

    return function webhook (req, res) {
        //const url = 'http://' + (req.query.url || 'no-url-defined');
        res.json({ msg: 'Hello World!' }).end();
    };
};

module.exports = handleReq;
