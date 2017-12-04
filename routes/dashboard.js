var express = require('express');
var router = express.Router();
var hiMate   = require('../models/dashboard');
var middleware = require('../middleware');
var geocoder = require('geocoder');

//==============
//Google Map API
//==============

//=============
//GET DASHBOARD
//=============
router.get('/', function(req, res){
	//get all content from db
	hiMate.find({}, function(err, dbContent){
		if (err){
			console.log(err);
		}else {
			var locations = {}, list = [];
			dbContent.forEach(function(x){locations.lat = x.lat; locations.lng = x.lng; list.push(locations) });
			res.render('dashboard/dashboard', {content:dbContent, currentUser: req.user, locations: list});
			console.log('list',typeof list);
		}
	});
});

//==============
//POST DASHBOARD
//==============
router.post('/',  middleware.isLoggedIn, function(req, res){
	//form and push to content array
	var title		= req.body.title;
	var location	= req.body.location;
	var time		= req.body.time;
	var requirement = req.body.requirement;
	var contact 	= req.body.contact;
	var text		= req.body.text;
	var hashtags	= req.body.hashtags;
	var author		= {
			id: req.user._id,
			username: req.user.username
	};
	geocoder.geocode(req.body.location, function (err, data) {
		console.log('data.results[0]',data);
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
	var newContent	= {
			title:title,
			location:location, 
			time:time,
			requirement:requirement,
			contact:contact,
			author: author,
			text:text, 
			hashtags:hashtags,
			location: location, lat: lat, lng: lng
		};
	//create a new himate and save to db
	hiMate.create(newContent, function(err, newContent){
		if (err){
			console.log(err);
			req.flash('error', err.message);
			res.redirect('back');
		}else {
			//redirect to dashboard
			res.redirect('/dashboard');
		}
	});
  });
});
//=================
//GET DASHBOARD NEW
//=================
router.get('/new', middleware.isLoggedIn, function(req, res){
	res.render('dashboard/new');
});

//================
//GET DASHBOARD:ID
//================
router.get('/:id', function(req, res){
	hiMate.findOne({_id: req.params.id}).populate('comments').exec(function(err, foundContent){
		if (err){
			console.log(err);
			req.flash('error', err.message);
		}else {
			console.log('foundContent',foundContent);
			res.render('dashboard/show', {foundContent:foundContent});
		}
	});
});

//==============
//EDIT DASHBOARD
//==============
router.get('/:id/edit', middleware.postOwnership, function(req, res){
	hiMate.findOne({_id: req.params.id}).exec(function(err, foundContent){
		if (err){
			req.flash('error', err.message);
		}else{
			res.render('dashboard/edit', {foundContent:foundContent});	
		}
	});
});
//================
//UPDATE DASHBOARD
//================
router.put('/:id', middleware.postOwnership, function(req, res){
	geocoder.geocode(req.body.location, function (err, data) {
		console.log('data.results[0]',data);
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = req.body.edit + {location: location, lat: lat, lng: lng};
	//update correspondant himate and save to db
	hiMate.findByIdAndUpdate(req.params.id, newData, function(err, editContent){
		if (err){
			console.log(err);
			req.flash('error', err.message);
			res.redirect('/dashboard');
		}else {
			//redirect to dashboard
			req.flash('success', 'Successfully updated');
			res.redirect('/dashboard/'+req.params.id);
		}
	});	
  });
});
//================
//DELETE DASHBOARD
//================
router.delete('/:id', middleware.postOwnership, function(req, res){
	//delete correspondant himate and save to db
	hiMate.findByIdAndRemove(req.params.id, function(err, editContent){
		if (err){
			console.log(err);
			req.flash('error', err.message);
			res.redirect('/dashboard');
		}else {
			//redirect to dashboard
			req.flash('success', 'successfully deleted');
			res.redirect('/dashboard');
		}
	});	
});

module.exports = router;