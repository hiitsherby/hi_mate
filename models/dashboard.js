var mongoose = require('mongoose');
var hiMateSchema = new mongoose.Schema({
	title: String,
	location: String,
	time: String,
	requirement: String,
	contact: String,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: { type: Date, default: Date.now },
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	text: String,
	hashtags: String,
	comments: [
	    {
	        type: mongoose.Schema.Types.ObjectId,
	        ref: 'Comment'
	    }
	]
});

module.exports = mongoose.model('hiMate', hiMateSchema);