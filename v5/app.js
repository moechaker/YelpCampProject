let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); //This should be below bodyparser
app.use(methodOverride("_method"));
console.log(__dirname);
seedDB();

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/campgrounds", function (req, res) {
  // get all campgrounds from db
  Campground.find({}, function (err, allcampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allcampgrounds });
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
  res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function (req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        //render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
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

// ================
// COMMENTS ROUTES
// ================

app.get("/campgrounds/:id/comments/new", function (req, res) {
  // find campground by id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

app.post("/campgrounds/:id/comments", function (req, res) {
  // lookup campground using ID
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });

  // connect new comment to campground
  // redirect campground show page
});

app.listen(1000, function () {
  console.log("The YelpCamp Server Has Started!!");
});
