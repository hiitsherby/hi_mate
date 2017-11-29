var Comment  = require('../models/comment'); 
var hiMate   = require('../models/dashboard');

//all the middleware goes here
var middlewareObj = {};

middlewareObj.commentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findOne({_id: req.params.comment_id}).exec(function(err, foundComment){
			if (err){
				console.log(err);
				req.flash('error', err.message);
				res.redirect('back');
			}else {
				//does user own the comment?
				if (req.user._id.equals(foundComment.author.id)){
					next();	
				}else{
				    req.flash('error', 'Permission denied');
					res.redirect('back');
				}
			}
		});		
	}else{
	    req.flash('error', 'Please login first!');
		res.redirect('back');//take user back to where they came from
	}    
};

middlewareObj.postOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		hiMate.findOne({_id: req.params.id}).exec(function(err, foundContent){
			if (err){
				console.log(err);
				req.flash('error', err.message);
				res.redirect('back');
			}else {
				//does user own the post?
				console.log(req.user._id);
				console.log(foundContent.author.id);
				if (req.user._id.equals(foundContent.author.id)){
					next();	
				}else{
				    req.flash('error', 'Permission denied');
					res.redirect('back');
				}
			}
		});		
	}else{
	    req.flash('error', 'Please login first!');
		res.redirect('back');//take user back to where they came from
	}    
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
	    req.flash('error', 'Please login first!');
		res.redirect('/login');
		
	}    
};

module.exports = middlewareObj;