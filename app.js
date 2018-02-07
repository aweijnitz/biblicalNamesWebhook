const appConf = require('./conf/appConfig.json');
const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const util = require('util');
const bodyParser = require('body-parser');

const log4js = require('log4js');
log4js.configure('./conf/log4js.json');
const logger = log4js.getLogger('app');

const Bot = require('facebook-messenger-bot').Bot;
const Elements = require('facebook-messenger-bot').Elements;

const setupServer = function setupServer(appConf, logger) {
    let app = express();
    app.use(bodyParser.json());

    logger.info('Configuring server ');
    logger.warn('SERVER IN MODE: ' + app.get('env'));



    logger.info('Configuring view engine');
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hjs');
    app.use(favicon());


    logger.info('Configuring logging engine');
    if (app.get('env') === 'development') {
        let devFormat = ':method :url - Status: :status Content-length: :content-length';
        app.use(log4js.connectLogger(log4js.getLogger("http"), { format: devFormat, level: 'auto' }));
    } else
        app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));


    const webroot = appConf.app.webroot || path.join(__dirname, 'public');
    logger.info('Setting webroot to ' + webroot);
    app.use(express.static(webroot));


    logger.info('Setting application routes');
    const routes = require('./routes/index');
    app.use('/', routes);

    logger.info('Setting up Messenger Bot webhook');

    const bot = new Bot(process.env.PAGE_TOKEN, process.env.VERIFY_TOKEN);
    bot.on('message', async message => {
        const {sender} = message;
        await sender.fetch('first_name');

        const out = new Elements();
        out.add({text: `hey ${sender.first_name}, how are you!`});

        await bot.send(sender.id, out);
    });
    app.use('biblicalnamesbot/webhook', bot.router());

/// catch 404 and forwarding to error handler
    app.use(function (req, res, next) {
        res.status(500);
        res.render('error', { error: err });
        next(err);
    });

/// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    return app;
};


module.exports = setupServer(appConf, logger);
