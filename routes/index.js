const express = require("express");
const router = express.Router();
const passport = require("passport");
const flash = require("connect-flash");
const User = require("../models/user");

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login");
  res.redirect("/login");
};

router.get("/", (req, res) => {
  res.render("landing", { title: "Homepage" });
});

// Auth Routes
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to Café Culture, " + user.username + "!");
      res.redirect("/cafes");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/cafes",
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.send("login done");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/cafes");
});

module.exports = router;
