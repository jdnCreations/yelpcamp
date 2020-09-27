const express		= require('express'),
	  app 			= express(),
	  bodyParser 	= require('body-parser'),
	  mongoose 		= require('mongoose'),
	  flash			= require('connect-flash'),
	  passport 		= require('passport'),
	  LocalStrategy = require('passport-local'),
	  methodOverride = require('method-override'),
	  seedDB 		= require('./seeds'),
	  Campground  	= require('./models/campground'),
	  Comment 		= require('./models/comment'),
	  User			= require('./models/user');

// requiring routes
const commentRoutes 	= require('./routes/comments'),
	  campgroundRoutes  = require('./routes/campgrounds'),
	  indexRoutes 	 	= require('./routes/index');


mongoose.connect('mongodb+srv://dev:pr0grammr@cluster0.j5whg.mongodb.net/<dbname>?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
	  useCreateIndex: true
    })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();	// seed the database

// PASSPORT CONFIG
app.use(require('express-session')({
	secret: 'ciabatta buns',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log('The YelpCamp Server has started!');
});