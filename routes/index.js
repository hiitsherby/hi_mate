var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var hiMate   = require('../models/dashboard');
var middleware = require('../middleware');
var User     = require('../models/user');

//=======
//LANDING
//=======
router.get('/', function(req, res){
	res.render('landing2');
});

//============
//USER ACCOUNT
//============
router.get('/user', middleware.isLoggedIn, function(req, res) {
	hiMate.find({}, function(err, dbContent){
		if (err){
			console.log(err);
			req.flash('error', err.message);
		}else {
			var pushContent = [];
			dbContent.forEach(function(post){
				if (req.user._id.equals(post.author.id)){
					pushContent.push(post);
				}
			});
			res.render('user', {content:pushContent});
		}
	});
});

router.get('/profile', middleware.isLoggedIn, function(req, res) {
	res.render('profile');    
});

//===========
//AUTH ROUTES
//===========
//show register form
router.get('/register', function(req, res){
	res.render('register');	
});
//handle signup logic
router.post('/register', function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err){
			console.log(err);
			req.flash('error', err.message);
			res.redirect('/register');
		}else{
			passport.authenticate('local')(req, res, function(){
				req.flash('success', 'successfully signed up. Nice to meet you '+newUser.username);
				res.redirect('/dashboard');	
			});
		}
	});
});

//handle signup logic of landing page
router.post('/', function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err){
			console.log(err);
			req.flash('error', err.message);
			res.redirect('/register');
		}else{
			passport.authenticate('local')(req, res, function(){
				req.flash('success', 'successfully signed up. Nice to meet you '+newUser.username);
				res.redirect('/dashboard');	
			});
		}
	});
});

//show login form
router.get('/login', function(req, res){
	res.render('login');	
});
//handle login logic
router.post('/login', passport.authenticate('local', 
	{
		successRedirect: '/dashboard',
		failureRedirect: '/login'
		
	}), function(){
});

//logout route
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'successfully logged out');
	res.redirect('/dashboard');
});


module.exports = router;