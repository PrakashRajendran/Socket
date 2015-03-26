var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

//Import log4js framework to write and display logs
var log4js = require('../logger.js');
var log=log4js.LOG;

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        log.info('Seems there is an error in signup process: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        log.info('User already exists with username: '+username + '. Please try the different username.');
                        return done(null, false, { username: username});
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');
						newUser.occupation = req.param('occupation');

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                log.info('Seems there is an error in saving the user: '+err);  
                                throw err;  
                            }
                            log.info('User Registration succesfull. Redirecting to.....creating user session......redirecting user to dashboard');    
                            return done(null, newUser, { successRedirect: 'dashboard'} );
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
		log.info('Encrypting user password to save in database');
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}