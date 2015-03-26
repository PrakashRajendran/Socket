
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	firstName: String,
	lastName: String,
	occupation: String
});