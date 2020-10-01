let express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground");

// INDEX - SHOW ALL CAMPGROUNDS
router.get("/", function (req, res) {
  // get all campgrounds from db
  Campground.find({}, function (err, allcampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allcampgrounds });
    }
  });
});

// Create - add new campground to DB
router.post("/", isLoggedIn, function (req, res) {
  //create new campground and save to database
  let name = req.body.name,
    image = req.body.image,
    description = req.body.description,
    author = {
      id: req.user._id,
      username: req.user.username,
    };
  let newCampground = {
    name: name,
    image: image,
    description: description,
    author: author,
  };
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

// New - show form to create new campground
router.get("/new", isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
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

// Update Campground Routes
router.get("/:id/edit", function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.render("edit", { campground: foundCampground });
    }
  });
});

router.put("/:id", function (req, res) {
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

// Delete Campgroud Route
router.delete("/:id", function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
