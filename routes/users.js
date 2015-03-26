/* Import the express package */
var express = require('express');
var app = express.Router();

//Import log4js framework to write and display logs
var log4js = require('../logger.js');
var log=log4js.LOG; 

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		log.info(req.username + 'is authenticated');
		return next();
	// if the user is not authenticated then redirect him to the login page
	log.info('Oops!! Username: ' + req.username + 'is not authorized to access the app. Redirecting the user to login');
	res.redirect('/');
}

module.exports = function(passport) {
	 /*
			GET contact
	 */
	app.get('/contact', function(req, res) {
	  // redirect to contact page
	  log.info('Redirecting to contact page');
	  res.render('contact', { title: 'SocketWebApp | Contact Us'})
	});
	 
	/*
		GET login 
	*/
	app.get('/', function(req, res) {
	  // redirect to login page
	  log.info('Redirecting to login page');
	  res.render('login', { title: 'SocketWebApp | Login Now'})
	});
	  
	app.get('/login', function(req, res) {
	  // display login page
	  log.info('Displaying login page');
	  res.render('login', { title: 'SocketWebApp | Login Now', username: req.username});
	 });
	  
	/* 	POST /login
		Call login passport when login details are submitted 
		Success - /dashboard
		Failure - /login
	*/
	app.post('/', passport.authenticate('login', {
		successRediloginrect: '/dashboard',
		failureRedirect: '/',
		failureFlash : true 
	}));
	 
	 
	/**
	 * GET dashboard
	 */
	app.get('/dashboard', isAuthenticated, function(req, res) {
		log.info('Username: '+ req.username + ' is authenticated and allowing access to dashboard');
	  res.render('dashboard', { title: 'SocketWebApp | Dashboard', username: req.user.username});
	});
	  
	/**
	 * GET signup
	 */
	app.get('/signup', function(req, res){
		log.info('Displaying signup page');
		res.render('register',{message: req.flash('message')});
	});
	  
	 
	/* 	POST signup 
		Success - /dashboard
		Failure - /signup
	*/	  
	app.post('/signup', function(req, res, next) {
		passport.authenticate('signup', {
		successRedirect: '/dashboard',
		failureRedirect: '/signup'
	},function(err, user, info) {
		if (err) { return next(err); }
			if (!user) { return res.send('User already exists with ' + info.username); }
			req.logIn(user, function(err) {
				log.info('User : ' + user.username + 'is currently logged in');
				if (err) { return next(err); }
				return res.json({redirector: info, user : user.username});
			});
		})(req, res, next);
	});

	/* GET signout */
	app.get('/signout', isAuthenticated, function(req, res) {
	  req.logout();
	  log.info('User : ' + user.username + 'is logged out from the system');
	  res.redirect('/'); // redirect to login page if user clicks on signout link
	});
	 
	return app;
}
