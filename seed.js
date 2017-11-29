var mongoose = require('mongoose');
var hiMate = require('./models/dashboard');
var Comment = require('./models/comment');

var data = [
	{
		title: 'study group for IELTS',
		text: `Looking for study mates for IELTS test,
		       once a week, evening time at school cafe.
		       If youre interested you can email me sherry@mail.com`,
		hashtags: 'language, english, IELTS, study group'
	},
	{
		title: 'study group for TOFEL',
		text: `Looking for study mates for IELTS test,
		       once a week, evening time at school cafe.
		       If youre interested you can email me sherry@mail.com`,
		hashtags: 'language, english, TOFEL, study group'
	}
];

// function seedDB(){
//     //Remove all mates
//     hiMate.remove({}, function(err){
//         if (err){
//             console.log(err);
//         }else{
//   //         console.log('data removed!');
//   //         //add new mates
// 			// data.forEach(function(seed){
// 			// 	hiMate.create(seed, function(err, himate) {
// 			// 	    if (err) console.log(err);
// 			// 	    else {
// 			// 	        console.log('data added');
//   //                     //create comment
//   //                     Comment.create(
//   //                         {
//   //                             text:'interested, mail sent.',
//   //                             author:'Janet'
                                
//   //                         }, function(err, comment){
//   //                             if (err) console.log(err);
//   //                             else {
//   //                                 himate.comments.push(comment);
//   //                                 himate.save();
//   //                                 console.log('new comment created')
//   //                             }
//   //                     })
// 			// 	    }        
// 			// 	});
// 			// });
//         }
//     });
// }

// module.exports = seedDB;