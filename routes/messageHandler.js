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

module.exports = function messageHandler(message, sender) {

    return `hey ${sender.first_name}, how are you!`;
};
