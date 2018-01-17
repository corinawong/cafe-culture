const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/cafe-culture", {
  useMongoClient: true
});

// Schema setup
const cafeSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Cafe = mongoose.model("Cafe", cafeSchema);

// Cafe.create({
//   name: "Board Games Café",
//   image: "https://farm5.staticflickr.com/4110/5024733655_892e48ed8c_b.jpg"
// }).then(
//   cafe => {
//     console.log("NEW CAFE", cafe);
//   },
//   err => {
//     console.log(err);
//   }
// );

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("landing", {
    title: "Homepage"
  });
});

app.get("/cafes", (req, res) => {
  Cafe.find().then(
    cafes => {
      res.render("index", {
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
  res.render("new", {
    title: "Add a new Café"
  });
});

app.post("/cafes", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const newCafe = { name, image };
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
  res.render("show");
});

app.listen(3000, () => {
  console.log("Café Culture server started...");
});
