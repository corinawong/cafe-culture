const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

var cafes = [
  { name: "Cat Café" },
  { name: "Board Games Café" },
  { name: "Robot Café" }
];

app.get("/", (req, res) => {
  res.render("index", {
    title: "Homepage"
  });
});

app.get("/cafes", (req, res) => {
  res.render("cafes", {
    title: "Cafés",
    cafes
  });
});

app.get("/cafes/new", (req, res) => {
  res.render("new", {
    title: "Add a new Café"
  });
});

app.post("/cafes", (req, res) => {
  let name = req.body.name;
  let newCafe = { name };
  cafes.push(newCafe);
  res.redirect("/cafes");
});

app.listen(3000, () => {
  console.log("Café Culture server started...");
});
