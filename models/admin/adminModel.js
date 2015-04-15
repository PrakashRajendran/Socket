/**
 * Module dependencies.
 */

 /* Define the mongoose model for DirectorySchema */
 var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema
 */

/* Create the database properties for Directory Schema */
var UserSchema = new Schema({
  id: { type: String, default: '' },
  username: { type: String, default: '' },
  password: { type: String, default: '' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  occupation: { type: String, default: '' },
  phoneno: { type: String, default: '' },
  city: { type: String, default: '' },
  province: { type: String, default: '' }
});

var User =  mongoose.model('User', UserSchema);

// make this available to our users in our Node applications
module.exports = User;
