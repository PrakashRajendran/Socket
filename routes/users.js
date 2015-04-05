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
	if (req.isAuthenticated()) {
		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	log.info('Oops!! Cannot invoke the user session without proper authentication. Redirecting the user to login');
	res.redirect('/');
}

module.exports = function(passport) {
	 
	/*	GET contact */
	app.get('/contact', function(req, res) {
	  // redirect to contact page
	  log.info('Redirecting to contact page');
	  res.render('contact', { title: 'SocketWebApp | Contact Us'})
	});
	 
	/* GET login page. */
	app.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});
	

	/* POST Login  */
	app.post('/login', function(req, res, next) {
		passport.authenticate('login', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash : true  
	},function(err, user, info) {
		if (err) { return next(err); }
			if (!user) { return res.redirect('/login'); }
			req.logIn(user, function(err) {
				log.info('User : ' + user.firstName + ' ' + user.lastName + ' is currently logged in');
				if (err) { return next(err); }
					return res.json({redirector: info.successRedirect, loggedUser : user.firstName + ' ' + user.lastName});
			});
		})(req, res, next);
	});

	/* GET Registration */
	app.get('/register', function(req, res){
		res.render('register',{message: req.flash('message')});
	});
	  
	 
	/* 	POST register 
		Success - /dashboard
		Failure - /register
	*/	  
	app.post('/register', function(req, res, next) {
		passport.authenticate('register', {
		successRedirect: '/dashboard',
		failureRedirect: '/register',
		failureFlash : true
	},function(err, user, info) {
		if (err) { return next(err); }
			if (!user) { return res.send('User already exists with ' + info.username); }
			req.logIn(user, function(err) {
				log.info('User : ' + user.firstName + ' ' + user.lastName + 'is currently logged in');
				if (err) { return next(err); }
				return res.json({redirector: info, loggedUser : req.session.passport.user});
			});
		})(req, res, next);
	});
	
	/* GET Dashboard */
	app.get('/dashboard', isAuthenticated, function(req, res){
		res.render('dashboard', { loggedUser: req.loggedUser });
	});

	/* GET signout */
	app.get('/signout', isAuthenticated, function(req, res) {
	  req.logout();
	  log.info('User : ' + req.user + 'is logged out from the system');
	  res.redirect('/'); // redirect to login page if user clicks on signout link
	});
	 
	return app;
}
