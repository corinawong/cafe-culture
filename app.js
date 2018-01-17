const express = require("express");
const path = require("path");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {
    title: "Homepage"
  });
});

app.get("/cafes", (req, res) => {
  var cafes = [
    { name: "Cat Café", image: "" },
    { name: "Board Games Café" },
    { name: "Robot Café" }
  ];
  res.render("cafes", {
    title: "Cafés",
    cafes
  });
});

app.listen(3000, () => {
  console.log("Café Culture server started...");
});
