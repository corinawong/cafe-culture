const express = require("express");
const router = express.Router({ mergeParams: true });
const flash = require("connect-flash");
const Cafe = require("../models/cafe");
const Comment = require("../models/comment");

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login");
  res.redirect("/login");
};

const checkCommentAuthor = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentId, (err, comment) => {
      if (err) {
        req.flash("error", "Something went wrong");
        res.redirect("back");
      } else {
        // is user the author?
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Permission denied");
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

// -------- /cafes/:id/comments

router.get("/new", loggedIn, (req, res) => {
  Cafe.findById(req.params.id)
    .then(cafe => {
      res.render("comments/new", { cafe });
    })
    .catch(e => console.log(e));
});

// Create comment
router.post("/", loggedIn, (req, res) => {
  Cafe.findById(req.params.id)
    .then(cafe => {
      Comment.create(req.body.comment).then(comment => {
        // add username and id to comment
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        cafe.comments.push(comment);
        cafe.save();
        req.flash("success", "Review saved");
        res.redirect("/cafes/" + cafe._id);
      });
    })
    .catch(e => {
      console.log(e);
      res.redirect("/cafe");
    });
});

// Edit comment form
router.get("/:commentId/edit", checkCommentAuthor, (req, res) => {
  Comment.findById(req.params.commentId)
    .then(comment => {
      res.render("comments/edit", { cafe_id: req.params.id, comment });
    })
    .catch(() => {
      res.redirect("back");
    });
});

// Update comment
router.put("/:commentId", (req, res) => {
  Comment.findByIdAndUpdate(req.params.commentId, req.body.comment)
    .then(() => {
      res.redirect(`/cafes/${req.params.id}`);
    })
    .catch(() => {
      res.redirect("back");
    });
});

// Delete comment
router.delete("/:commentId", checkCommentAuthor, (req, res) => {
  Comment.findByIdAndRemove(req.params.commentId)
    .then(() => {
      req.flash("success", "Review deleted");
      res.redirect(`/cafes/${req.params.id}`);
    })
    .catch(() => {
      res.redirect("back");
    });
});

module.exports = router;
