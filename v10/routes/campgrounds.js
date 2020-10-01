let express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middleware = require("../middleware"); // index.js is a special name, we don't have to require it like this require("../middleware/index.js")

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
router.post("/", middleware.isLoggedIn, function (req, res) {
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
router.get("/new", middleware.isLoggedIn, function (req, res) {
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

// Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (
  req,
  res
) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// Delete Campgroud Route
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (
    err,
    campgroundDeleted
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      Comment.deleteMany(
        { _id: { $in: campgroundDeleted.comments } },
        function (err) {
          if (err) {
            res.redirect("/campgrounds");
          } else {
            res.redirect("/campgrounds");
          }
        }
      );
    }
  });
});

module.exports = router;
