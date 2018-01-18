const express = require("express");
const router = express.Router({ mergeParams: true });
const Cafe = require("../models/cafe");
const Comment = require("../models/comment");

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// -------- /cafes/:id/comments

router.get("/new", loggedIn, (req, res) => {
  Cafe.findById(req.params.id)
    .then(cafe => {
      res.render("comments/new", { cafe });
    })
    .catch(e => console.log(e));
});

router.post("/", loggedIn, (req, res) => {
  Cafe.findById(req.params.id)
    .then(cafe => {
      Comment.create(req.body.comment).then(comment => {
        cafe.comments.push(comment);
        cafe.save();
        res.redirect("/cafes/" + cafe._id);
      });
    })
    .catch(e => {
      console.log(e);
      res.redirect("/cafe");
    });
});

module.exports = router;
