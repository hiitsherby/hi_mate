var express 		= require('express'),
	app 			= express(),
	bodyParser		= require('body-parser'),
	mongoose		= require('mongoose'),
	passport		= require('passport'),
	LocalStrategy	= require('passport-local'),
	User			= require('./models/user'),
	methodOverride	= require('method-override'),
	hiMate			= require('./models/dashboard'),
	flash			= require('connect-flash'),
	Comment			= require('./models/comment');
	
	var commentRoutes   = require('./routes/comments'),
		dashboardRoutes = require('./routes/dashboard'),
		indexRoutes		= require('./routes/index');
// 	seedDB		= require('./seed');

	
// seedDB();
// mongoose.connect("mongodb://localhost/hi_mate");
mongoose.connect("mongodb://hiitsherby:WenYen0u0@ds123926.mlab.com:23926/himate");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');

//======================
//PASSPORT CONFIGURATION
//======================
app.use(require("express-session")({
	secret: 'this is secret',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser	= req.user;
	res.locals.error		= req.flash('error');
	res.locals.success		= req.flash('success');
	next();
});

app.use('/dashboard/:id/comments', commentRoutes);
app.use('/dashboard', dashboardRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, () => console.log('Listening on port 3000!'));