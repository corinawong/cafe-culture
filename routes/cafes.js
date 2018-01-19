const express = require("express");
const router = express.Router();
const Cafe = require("../models/cafe");

// middleware
const loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const checkCafeAuthor = (req, res, next) => {
  if (req.isAuthenticated()) {
    Cafe.findById(req.params.id, (err, cafe) => {
      if (err) {
        res.redirect("back");
      } else {
        // is user the author?
        if (cafe.author.id.equals(req.user._id)) {
          // move on to the next step
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

// -------- /cafes

// Show all cafes
router.get("/", (req, res) => {
  Cafe.find()
    .then(cafes => {
      res.render("cafes/index", {
        title: "Cafés",
        cafes
      });
    })
    .catch(err => console.log(err));
});

// New cafe form
router.get("/new", loggedIn, (req, res) => {
  res.render("cafes/new", { title: "Add a new Café" });
});

// Create a cafe entry
router.post("/", loggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCafe = { name, image, description, author };
  Cafe.create(newCafe)
    .then(cafe => {
      console.log(newCafe);
      res.redirect("/cafes");
    })
    .catch(err => console.log(err));
});

// Individual cafe with comments
router.get("/:id", (req, res) => {
  Cafe.findById(req.params.id)
    .populate("comments")
    .exec((err, cafe) => {
      if (err) {
        console.log(e);
      } else {
        res.render("cafes/show", {
          title: cafe.name,
          cafe
        });
      }
    });
});

// Edit cafe form
router.get("/:id/edit", checkCafeAuthor, (req, res) => {
  Cafe.findById(req.params.id)
    .then(cafe => {
      res.render("cafes/edit", { cafe });
    })
    .catch(e => console.log(e));
});

// Update Cafe
router.put("/:id", checkCafeAuthor, (req, res) => {
  Cafe.findByIdAndUpdate(req.params.id, req.body.cafe, (err, updatedCafe) => {
    if (err) {
      res.redirect("/cafes");
    } else {
      res.redirect("/cafes/" + req.params.id);
    }
  });
});

// Delete a cafe
router.delete("/:id", checkCafeAuthor, (req, res) => {
  Cafe.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/cafes");
    } else {
      res.redirect("/cafes");
    }
  });
});

module.exports = router;
