var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/userModel');
var bCrypt = require('bcrypt-nodejs');

var log4js = require('../logger.js');
var log=log4js.LOG; 

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
			console.log(username.substring(6,username.length));
            if (username.startsWith("admin/")) {
				console.log("6876876876868");
				// check in mongo if a user with username exists or not
				User.findOne({ 'username' :  username.substring(6,username.length) }, 
					function(err, user) {
						// In case of any error, return using the done method
						if (err)
							return done(err);
						// Username does not exist, log the error and redirect back
						if (!user){
							log.info('User Not Found with username '+username);
							return done(null, false, req.flash('message', 'User Not found.'));                 
						}
						if(user.username!=='socket' && user.password!=='socket123') {
							log.info('This User ' + username +' is not authorized to access this admin portal');
							return done(null, false, req.flash('message', 'This User ' + username +' is not authorized to access this admin portal'));                 
						}
						// User exists but wrong password, log the error 
						if (!isValidPassword(user, password)){
							log.info('Invalid Password');
							return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
						}
						// User and password both match, return user from done method
						// which will be treated like success
						console.log(user);
						log.info('User and password matching....Administrator is logging in');
						return done(null, user, { successRedirect: '/admin/data', user: user } );
					}
				);
			}else {
				console.log("534535435435434354");
				// check in mongo if a user with username exists or not
				User.findOne({ 'username' :  username }, 
					function(err, user) {
						// In case of any error, return using the done method
						if (err)
							return done(err);
						// Username does not exist, log the error and redirect back
						if (!user){
							log.info('User Not Found with username '+username);
							return done(null, false, req.flash('message', 'User Not found.'));                 
						}
						
						// User exists but wrong password, log the error 
						if (!isValidPassword(user, password)){
							log.info('Inva111lid Password');
							return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
						}
						// User and password both match, return user from done method
						// which will be treated like success
						console.log(user);
						log.info('User and password matching....User is logging in');
						return done(null, user, { successRedirect: 'dashboard', user: user } );
					}
				); 
			}

        })
    );

	if (typeof String.prototype.startsWith != 'function') {
	  // see below for better implementation!
	  String.prototype.startsWith = function (str){
		return this.indexOf(str) === 0;
	  };
	}

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
}
