//const appConf = require('../conf/appConfig.json');
const os = require('os');
const util = require('util');
const fs = require('fs');

const {Wit, log} = require('node-wit');



/**
 * Private helper to sanity check a string before using it.
 * @param str
 * @returns {boolean}
 */
const isDefined = function (str) {
    return (typeof str != 'undefined' && null != str && '' != str);
};

module.exports = function messageHandler(message, sender) {

    const client = new Wit({
        accessToken: 'DEK5LYCA2JTYEX43EBVJSNKG5JNPX6X4',
        logger: new log.Logger(log.DEBUG) // optional
    });


    return client.message(message, {});

};
