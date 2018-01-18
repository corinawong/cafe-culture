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

const indexRoutes = require("./routes/index");
const cafeRoutes = require("./routes/cafes");
const commentRoutes = require("./routes/comments");

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

// Pass currentUser variable to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use("/cafes", cafeRoutes);
app.use("/cafes/:id/comments", commentRoutes);

app.listen(3000, () => {
  console.log("Café Culture server started...");
});
