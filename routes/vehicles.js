/* Import the express package */
var express = require('express');
var Vehicle = require('../models/vehicleModel');
var app = express.Router();
var vehicleDAO = require('../models/vehicleDAO');

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
	
	

	/**	
	 *	requestType	:	/GET
	 *	routeName	:	/add-vehicle
	 *	description	:	Get all the business directory listings and display them in the index page
	 */
	app.get('/add-vehicle', function(req, res) {
		res.render('add-vehicle');
	});
	
	/**	
	 *	requestType	:	/POST
	 *	routeName	:	/add-vehicle
	 *	description	:	Get all the business directory listings and display them in the index page
	 */
	app.post('/add-vehicle', function(req, res) {

		var newVehicle = new Vehicle();

			// set the user's local credentials
			newVehicle.vehicle_name = req.body.vehiclename;
			newVehicle.vehicle_model_name = req.body.vehiclemodelname;
			newVehicle.vehicle_manufacturer_date = req.body.vehiclemanufacturerdate;
			newVehicle.vehicleType = req.body.vehicletype;
			newVehicle.vehicle_license_number = req.body.vehiclelicenseno;
			newVehicle.user = req.session.user_id;
			
			console.log('proceeding to add new vehicle.......user_id : ' + req.session.user_id);

			// save the new vehicle
			newVehicle.save(function(err, newVehicle) {
				if (err){
					log.info('Seems there is an error in saving the new vehicle: '+err);  
					throw err;  
				}
				log.info('New vehicle added succesfull. Redirecting to.....list vehicles page');    
				vehicleDAO.loadUserVehicles(req, res);
			});
		
	});
		
	/**	
	 *	requestType	:	/GET
	 *	routeName	:	/list-vehicles
	 *	description	:	Get all the business directory listings and display them in the index page
	 */
	app.get('/list-vehicles', function(req, res) {
	console.log('before 1' + req.session.user_id);
		Vehicle.find({ user: req.session.user_id }).populate('Vehicle').exec(function(err, vehicles) { 

			// check if the vehicles from the database is empty or not
			if (isEmpty(vehicles)) {
				res.render('list-vehicles', { vehicles: { message : 'No records'} });
			}else {
				// render the browse directory route page with records
				res.render('list-vehicles', { vehicles: vehicles });
			}
		});
	});
	
	/**
	 *	functionName	: isEmpty
	 *	description		: It is used to check the object empty or not
	 */
	var isEmpty = function(obj) {
	  return Object.keys(obj).length === 0;
	}

	
	/**	
	 *	requestType	:	/POST
	 *	routeName	:	/start-charge
	 *	description	:	Get all the business directory listings and display them in the browse-directory page
	 */
	app.post('/start-charge', function (req, res, next) {
		res.render('start-charge');
	});
	
	/**	
	 *	requestType	:	/GET
	 *	routeName	:	/charge
	 *	description	:	Get all the business directory listings and display them in the browse-directory page
	 */
	app.get('/charge', function (req, res, next) {
		vehicleDAO.chargePopulateVehiclesInfo(req, res);
	});
	
	/**	
	 *	requestType	:	/GET
	 *	paramId		:	id
	 *	routeName	:	/edit-directory/:id
	 *	description	:	Get all the business directory listings and display them in the browse-directory page
	 */
	app.get('/delete-vehicle/:id', function (req, res, next) {
		
		//get the id from the request parameter to edit the business listing
		var vehicle_id = req.params.id;
		
		//use the directory model to look up the business listing with above id and remove the document
		Vehicle.findByIdAndRemove(vehicle_id, function (err, vehicle) {
			
			//error
			if (err) {
				res.render('error', { error: 'Error deleting the vehicle record ==>' + vehicle_id, errorStack: err.stack} );
			}
			else {
				vehicleDAO.loadUserVehicles(req, res);
			}
		});
	});
	
	/**	
	 *	requestType	:	/GET
	 *	routeName	:	/edit-vehicle/:id
	 *	paramId		: 	id
	 *	description	:	Get all the business directory listings and display them in the index page
	 */
	app.get('/edit-vehicle/:id', function(req, res) {

		//get the id from the request parameter to edit the business listing
		var vehicle_id = req.params.id;

		//use the product model to look up the product with this id    
		Vehicle.findById(vehicle_id, function (err, vehicleObj) {
			if (err) {
				res.render('error', { error: 'Vehicle ' + vehicle_id + ' not found', errorStack: err.stack} );
			}
			else {
				console.log(vehicleObj);
				res.render('edit-vehicle', { editVehicleModel: vehicleObj}); // record found and redirecting to display the business listing information 
			}
		});
	});
	
	/**	
	 *	requestType	:	/POST
	 *	routeName	:	/edit-vehicle/
	 *	description	:	Get all the business directory listings and display them in the index page
	 */
	app.post('/edit-vehicle', function(req, res) {
		
		var vehicle_id = req.body.vehicle_id;
		
		// Post the form data from add-directory page
		var updateVehicleObj, vehicle;
		
			
		updateVehicleObj = {
			vehicle_name : req.body.vehiclename,
			vehicle_model_name : req.body.vehiclemodelname,
			vehicle_manufacturer_date : req.body.vehiclemanufacturerdate,
			vehicleType : req.body.vehicletype,
			vehicle_license_number : req.body.vehiclelicenseno,
			user : req.session.user_id
		}

		Vehicle.update({ _id: vehicle_id}, updateVehicleObj, function(err) {
			if (err) {
				res.render('error', { error: 'Error updating vehicle ' + vehicle_id, errorStack: err.stack} );
			} else {  //update
				vehicleDAO.loadUserVehicles(req, res);
			}
		});
	});

	return app;
}
