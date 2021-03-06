const appConf = require('../conf/appConfig.json');
const express = require('express');
const router = express.Router();

const log4js = require('log4js');
log4js.configure('./conf/log4js.json');
const logger = log4js.getLogger("index");


// Load route handlers (doubling as rudimentary MVC controllers)

// Remember, in Express 4, '/' is the root under which this route is mounted, so does not
// necessarily correspond to the absolute root of the domain.
//
router.get('/', function(req, res) {
  logger.debug('Serving / --> index.hjs');
  res.render('index', { title: 'Biblical Names Webhook' });
});

router.get('/privacy', function(req, res) {
    logger.debug('Serving / --> privacypolicy.hjs');
    res.render('privacypolicy', { title: 'Biblical Names Privacy Policy' });
});

router.get('/tos', function(req, res) {
    logger.debug('Serving / --> tos.hjs');
    res.render('tos', { title: 'Biblical Names Terms of Service' });
});


module.exports = router;
