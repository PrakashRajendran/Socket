/**
 * Module dependencies.
 */

 /* Define the mongoose model for DirectorySchema */
 var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

/**
 * User Schema
 */

/* Create the database properties for Vehicle Schema */
var VehicleSchema = new Schema({
  id: { type: String, default: '' },
  vehicle_name: { type: String, default: '' },
  vehicle_model_name: { type: String, default: '' },
  vehicle_manufacturer_date: { type: String, default: '' },
  vehicleType: { type: String, default: '' },
  vehicle_license_number: { type: String, default: '' },
  user  : { type: ObjectId, ref: 'UserSchema' }
});


var Vehicle =  mongoose.model('Vehicle', VehicleSchema);


// make this available to our users in our Node applications
module.exports = Vehicle;
