const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Cafe = require("./models/cafe");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/cafe-culture", {
  useMongoClient: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// seedDB();

// Passport Config
app.use(
  require("express-session")({
    secret: "And this too shall pass",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("landing", { title: "Homepage" });
});

app.get("/cafes", (req, res) => {
  Cafe.find().then(
    cafes => {
      res.render("cafes/index", {
        title: "Cafés",
        cafes
      });
    },
    err => {
      console.log(err);
    }
  );
});

app.get("/cafes/new", (req, res) => {
  res.render("cafes/new", { title: "Add a new Café" });
});

app.post("/cafes", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const newCafe = { name, image, description };
  Cafe.create(newCafe).then(
    cafe => {
      res.redirect("/cafes");
    },
    e => {
      console.log(e);
    }
  );
});

app.get("/cafes/:id", (req, res) => {
  Cafe.findById(req.params.id)
    .populate("comments")
    .exec((err, cafe) => {
      if (err) {
        console.log(e);
      } else {
        console.log(cafe);
        res.render("cafes/show", {
          title: cafe.name,
          cafe
        });
      }
    });
});

// Comment Routes

app.get("/cafes/:id/comments/new", (req, res) => {
  Cafe.findById(req.params.id)
    .then(cafe => {
      res.render("comments/new", { cafe });
    })
    .catch(e => console.log(e));
});

app.post("/cafes/:id/comments", (req, res) => {
  Cafe.findById(req.params.id)
    .then(cafe => {
      console.log(req.body.comment);
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

// Auth Routes
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/cafes");
    });
  });
});

app.listen(3000, () => {
  console.log("Café Culture server started...");
});
