let mongoose = require("mongoose");
let Campground = require("./models/campground");
let Comment = require("./models/comment");

let seeds = [
  {
    name: "Cloud's Rest",
    image:
      "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: "blah blah blah",
  },
  {
    name: "Desert Mesa",
    image:
      "https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: "blah blah blah",
  },
  {
    name: "Canyon Floor",
    image:
      "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: "blah blah blah",
  },
];

async function seedDB() {
  try {
    await Campground.deleteMany({});
    console.log("Campgrounds Removed!");
    await Comment.deleteMany({});
    console.log("Comments Removed!");

    for (const seed of seeds) {
      let campground = await Campground.create(seed);
      console.log("Campground Created!");
      let comment = await Comment.create({
        text: "This place is great, but I wish there was internet",
        author: "Homer",
      });
      console.log("Comment Created!");
      campground.comments.push(comment);
      campground.save();
      console.log("Comment added to campground");
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = seedDB;
