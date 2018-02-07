const appConf = require('../conf/appConfig.json');
const express = require('express');
const router = express.Router();

const log4js = require('log4js');
log4js.configure('./conf/log4js.json');
const logger = log4js.getLogger("index");


// Load route handlers (doubling as rudimentary MVC controllers)
const challengeHandler = require('./biblicalNamesChallengeRequestHandler.js');
const messageHandler = require('./messageHandler');

// Remember, in Express 4, '/' is the root under which this route is mounted, so does not
// necessarily correspond to the absolute root of the domain.
//
router.get('/biblicalnamesbot', function(req, res) {
  logger.debug('Serving / --> index.hjs');
  res.render('index', { title: 'Biblical Names Webhook' });
});


router.get('/biblicalnamesbot/webhook', challengeHandler(appConf, log4js));

router.post('/biblicalnamesbot/webhook', messageHandler(appConf, log4js));

module.exports = router;
