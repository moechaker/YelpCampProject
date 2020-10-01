let express = require("express"),
  router = express.Router({
    mergeParams: true
  }),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middleware = require("../middleware"); // index.js is a special name, we don't have to require it like this require("../middleware/index.js")

// ================
// COMMENTS ROUTES
// ================

// Comments - New
router.get("/new", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err || !campground) {
      req.flash("error", "Campground not found");
      res.redirect("back");
    } else {
      res.render("comments/new", {
        campground: campground
      });
    }
  });
});

// Comments - Create
router.post("/", middleware.isLoggedIn, function (req, res) {
  // lookup campground using ID
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          req.flash("error", "Something Went Wrong!");
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // connect new comment to campground
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          // redirect campground show page
          req.flash("success", "Comment added successfully!");
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (
  req,
  res
) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err || !foundCampground) {
      req.flash("error", "Campground not found");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          campground_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  })
});

// Comment Update route
router.put("/:comment_id", middleware.checkCommentOwnership, function (
  req,
  res
) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted!");
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function (
  req,
  res
) {
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

module.exports = router;