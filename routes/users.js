/* Import the express package */
var express = require('express');
var User = require('../models/userModel');
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
	
	if (req.url.startsWith("/admin/")) {
		log.info('Oops!! Cannot invoke the admin session without proper authentication. Redirecting the admin to login');
		res.redirect('/admin');
	}else {
		log.info('Oops!! Cannot invoke the user session without proper authentication. Redirecting the user to login');
		res.redirect('/');
	}
	
}

module.exports = function(passport) {
	
	/*	GET about */
	app.get('/about', function(req, res) {
	  // redirect to contact page
	  log.info('Redirecting to contact page');
	  res.render('about', { title: 'SocketWebApp | about'})
	});
	
	app.get('/pizza-tip-calc', function(req, res) {
		res.render('pizza-tip-calc');
	});
	 
	/*	GET contact */
	app.get('/contact', function(req, res) {
	  // redirect to contact page
	  log.info('Redirecting to contact page');
	  res.render('contact', { title: 'SocketWebApp | Contact Us'})
	});

    /*	GET terms */
	app.get('/terms', function (req, res) {
	    // redirect to contact page
	    log.info('Redirecting to contact page');
	    res.render('terms', { title: 'SocketWebApp | terms' })
	});

	app.get('/pizza-tip-calc', function (req, res) {
	    res.render('pizza-tip-calc');
	});
	
	/*	GET history */
	app.get('/history', function(req, res) {
	  // redirect to contact page
	  log.info('Redirecting to contact page');
	  res.render('history', { title: 'SocketWebApp | history'})
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
					req.session.user_id = user._id;
					console.log('logged user session id ===============' + req.session.user_id);
					return res.json({redirector: info.successRedirect});
			});
		})(req, res, next);
	});

	/* GET Registration */
	app.get('/register', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

    /* GET loginAdmind */
	app.get('/loginAdmin', function (req, res) {
	    res.render('loginAdmin', { message: req.flash('message') });
	});

    /* GET message */
	app.get('/message', function (req, res) {
	    res.render('message', { message: req.flash('message') });
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
		console.log('dashboard ----- logged user session id ===============' + req.session.user_id);
		res.render('dashboard', { userInfo: req.user, update: 'disabled' });
	});
	
	/* POST Dashboard */
	app.post('/update-profile', isAuthenticated, function(req, res){
		console.log(req.body.request);
		if (req.body.request=='edit') {
			res.render('dashboard', { userInfo: req.user, update: 'enabled' });
		}else if(req.body.request=='update'){
			console.log('inside update');
			
			var query = {"_id": req.body.id};
			
			var options = { upsert: true };
			
			var updateQuery = { 
				username : req.body.username,
				firstName :  req.body.firstName,
				lastName :  req.body.lastName,
				phoneno :  req.body.phoneNo,
				city :  req.body.city,
				province :  req.body.province
			};
			 User.findOneAndUpdate(
				query,
				updateQuery,
				options
			 ,function(err, user) {
					console.log('inside callback');
                    // In case of any error, return using the done method
                    if (err) { return next(err); }
                    res.render('dashboard', { userInfo: user, update: 'disabled' });
                });
		}
	});
    /*	GET history */
	app.get('/history', function (req, res) {
	    // redirect to contact page
	    log.info('Redirecting to contact page');
	    res.render('history', { title: 'SocketWebApp | history' })
	});

    /*	GET admin/extractData */
	app.get('/data', function (req, res) {
	    // redirect to contact page
	    log.info('Redirecting to contact page');
	    res.render('data', { title: 'SocketWebApp | data' })
	});
	
	/* POST update-profile */
	app.get('/update-profile', isAuthenticated, function(req, res){
		res.render('dashboard', { userInfo: req.user, update: enabled });
	});

	/* GET signout */
	app.get('/signout', isAuthenticated, function(req, res) {
	  req.logout();
	  log.info('User : ' + req.user + 'is logged out from the system');
	  res.redirect('/'); // redirect to login page if user clicks on signout link
	});
	
	
	/* GET admin/signout */
	app.get('/admin/signout', isAuthenticated, function(req, res) {
	  req.logout();
	  log.info('Admin : ' + req.user + 'is logged out from the system');
	  res.redirect('/admin'); // redirect to login page if user clicks on signout link
	});
	
	
	/*	GET admin login page */
	app.get('/admin', function(req, res) {
	  // redirect to contact page
	  log.info('Redirecting to admin');
	  res.render('loginAdmin', { title: 'SocketWebApp | Admin Portal'})
	});
	
	
	/*	GET updateterms page */
	app.get('/admin/updateterms', isAuthenticated, function(req, res) {
	  // redirect to contact page
	  log.info('Redirecting to update terms page');
	  res.render('updateterms', { title: 'SocketWebApp | Admin | Update terms page'})
	});
	 
	if (typeof String.prototype.startsWith != 'function') {
	  // see below for better implementation!
	  String.prototype.startsWith = function (str){
		return this.indexOf(str) === 0;
	  };
	}
	 
	/*	GET data page */
	app.get('/admin/data', isAuthenticated, function(req, res) {
	  // redirect to data page
	  log.info('Redirecting to data page');
	  res.render('data', { title: 'SocketWebApp | Admin | Data History'})
	});
	
	return app;
}
