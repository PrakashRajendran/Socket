var Vehicle = require('../models/vehicleModel');

	exports.loadUserVehicles = function(req, res) {
		Vehicle.find({ user: req.session.user_id }).populate('Vehicle').exec(function(err, vehicles) { 
			// check if the vehicles from the database is empty or not
			if (isEmpty(vehicles)) {
				res.render('list-vehicles', { vehicles: { message : 'No records'} });
			}else {
				// render the browse directory route page with records
				res.render('list-vehicles', { vehicles: vehicles });
			}
		});
	}
	
	exports.chargePopulateVehiclesInfo = function(req, res) {
	console.log('user_id session inside chargePopulateVehiclesInfo' +req.session.user_id);
		Vehicle.find({ user: req.session.user_id }).populate('Vehicle').exec(function(err, vehicles) { 
			// check if the vehicles from the database is empty or not
			console.log('exports.chargePopulateVehiclesInfo');
			console.log(vehicles);
			if (isEmpty(vehicles)) {
				res.render('charge', { vehicles: { message : 'No records'} });
			}else {
				// render the browse directory route page with records
				res.render('charge', { vehicles: vehicles });
			}
		});
	}
	
	exports.startCharging = function(req, res) {
	console.log('user_id session inside chargePopulateVehiclesInfo' +req.session.user_id);
		Vehicle.find({ user: req.session.user_id }).populate('Vehicle').exec(function(err, vehicles) { 
			// check if the vehicles from the database is empty or not
			console.log('exports.chargePopulateVehiclesInfo');
			console.log(vehicles);
			if (isEmpty(vehicles)) {
				res.render('charge', { vehicles: { message : 'No records'} });
			}else {
				// render the browse directory route page with records
				res.render('charge', { vehicles: vehicles });
			}
		});
	}
	

	/**
	 *	functionName	: isEmpty
	 *	description		: It is used to check the object empty or not
	 */
	var isEmpty = function(obj) {
	  return Object.keys(obj).length === 0;
	}