const express = require("express");
const router = express.Router();
const Cafe = require("../models/cafe");

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// -------- /cafes

router.get("/", (req, res) => {
  // Render all cafes in DB
  console.log(req.user);
  Cafe.find()
    .then(cafes => {
      res.render("cafes/index", {
        title: "Cafés",
        cafes
      });
    })
    .catch(err => console.log(err));
});

router.post("/", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const newCafe = { name, image, description };
  Cafe.create(newCafe)
    .then(cafe => {
      res.redirect("/cafes");
    })
    .catch(err => console.log(err));
});

router.get("/new", (req, res) => {
  res.render("cafes/new", { title: "Add a new Café" });
});

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

module.exports = router;
