var express  = require('express');
var router   = express.Router({mergeParams: true});
var hiMate   = require('../models/dashboard');
var Comment  = require('../models/comment'); 
var middleware = require('../middleware');
//===================
//ADD COMMENT ROUTES
//===================
router.get('/new', middleware.isLoggedIn, function(req, res){
	//find comments by id
	hiMate.findOne({_id: req.params.id}, function(err, content){
		if (err) {
			req.flash('error', err.message);
			console.log(err);
			res.redirect('back');
		}else{
			res.render('comments/new', {content: content});		
		}
	});
});

//============
//POST COMMENT
//============
router.post('/', middleware.isLoggedIn, function(req, res){
	//look board by id
	hiMate.findOne({_id: req.params.id}, function(err, himate){
		if (err) {
			req.flash('error', err.message);
			res.redirect('/dashboard');
		}else{
			//create new comment
			Comment.create(req.body.comment, function(err,comment){
				if (err){
					console.log(err);
					req.flash('error', err.message);
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					himate.comments.push(comment);
					himate.save();
					req.flash('success', 'successfully added');
					res.redirect('/dashboard/'+req.params.id);
				}
			});
			
		}
	});
});


//============
//EDIT COMMENT
//============
router.get('/:comment_id/edit', middleware.commentOwnership, function(req, res){
	Comment.findOne({_id: req.params.comment_id}).exec(function(err, foundComment){
		if (err){
			req.flash('error', err.message);
			res.redirect('back');
		}else{
			res.render('comments/edit', {foundComment:foundComment, dashboard_id: req.params.id});	
		}
	});
});
//==============
//UPDATE COMMENT
//==============
router.put('/:comment_id', middleware.commentOwnership, function(req, res){
	//update correspondant himate and save to db
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, editContent){
		if (err){
			console.log(err);
			req.flash('error', err.message);
			res.redirect('/dashboard');
		}else {
			//redirect to dashboard
			req.flash('success', 'successfully updated');
			res.redirect('/dashboard/'+ req.params.id);
		}
	});	
});
//==============
//DELETE COMMENT
//==============
router.delete('/:comment_id', middleware.commentOwnership, function(req, res){
	//delete correspondant himate and save to db
	Comment.findByIdAndRemove(req.params.comment_id, function(err, editContent){
		if (err){
			console.log(err);
			req.flash('error', err.message);
			res.redirect('back');
		}else {
			//redirect to dashboard
			req.flash('success', 'successfully deleted');
			res.redirect('/dashboard/'+ req.params.id);
		}
	});	
});

module.exports = router;