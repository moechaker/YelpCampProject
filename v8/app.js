let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// Requiring Routes
let commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Once again Cocomelon is my worst enemy!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connecting Mongoose
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); //This should be below bodyparser
app.use(methodOverride("_method"));
console.log(__dirname);
// seedDB(); //seed the databases

// pass user data to all routes
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// Shortening Route Naming
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(1000, function () {
  console.log("The YelpCamp Server Has Started!!");
});
