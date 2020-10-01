let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); //This should be below bodyparser
app.use(methodOverride("_method"));

//schema setup
let campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

let Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Salmon Creek",
//     image:
//       "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&h=350",
//     description:
//       "This is a huge granite hill, no bathrooms. No water. Beautiful granite!",
//   },
//   function (err, campground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("NEWLY CREATED CAMPGROUND: ");
//       console.log(campground);
//     }
//   }
// );

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/campgrounds", function (req, res) {
  // get all campgrounds from db
  Campground.find({}, function (err, allcampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds: allcampgrounds });
    }
  });
});

app.post("/campgrounds", function (req, res) {
  //create new campgrounds and save to database
  req.body.newCamp.body = req.sanitize(req.body.newCamp.body);
  Campground.create(req.body.newCamp, function (err, allcampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", function (req, res) {
  res.render("new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function (req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { campground: foundCampground });
    }
  });
});

app.get("/campgrounds/:id/edit", function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.render("edit", { campground: foundCampground });
    }
  });
});

app.put("/campgrounds/:id", function (req, res) {
  req.body.newCamp.body = req.sanitize(req.body.newCamp.body);
  Campground.findByIdAndUpdate(req.params.id, req.body.newCamp, function (
    err,
    updatedBlog
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

app.delete("/campgrounds/:id", function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.listen(1000, function () {
  console.log("The YelpCamp Server Has Started!!");
});
