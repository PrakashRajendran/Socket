/* Import the module dependencies */
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('./logger.js');
var log=log4js.LOG;
var app = express();
var mongoose = require('mongoose');

/* 	Import the db.js file and connect to database 
	Local DB 		- 'mongodb://localhost/socketwebapp'
	Production DB 	- 'mongodb://socketwebadmin:socketwebadmin@ds061188.mongolab.com:61188/socketwebapp'
*/
var dbConfig = require('./db');
mongoose.connect(dbConfig.url);
log.info('Connected to database...' + dbConfig.url);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

//Import app routes
var routes = require('./routes/users')(passport);
var vehicles = require('./routes/vehicles')(passport);
app.use('/vehicle', vehicles);
app.use('/', routes);

/* catch 404 and forward to error handler */
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.get('pizza-tip-calc', function(req, res) {
	res.render('pizza-tip-calc');
});

// development error handler
if (app.get('env') === 'development') {
	app.locals.pretty = true;
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.listen(8999);

module.exports = app;
