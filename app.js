const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

var cafes = [
  {
    name: "Cat Café",
    image: "https://farm2.staticflickr.com/1689/24853484936_04d64c273a_k.jpg"
  },
  {
    name: "Board Games Café",
    image: "https://farm5.staticflickr.com/4110/5024733655_892e48ed8c_b.jpg"
  },
  {
    name: "Robot Café",
    image: "https://farm2.staticflickr.com/1401/1475297269_3082a71c04_z.jpg"
  },
  {
    name: "Cat Café",
    image: "https://farm2.staticflickr.com/1689/24853484936_04d64c273a_k.jpg"
  },
  {
    name: "Board Games Café",
    image: "https://farm5.staticflickr.com/4110/5024733655_892e48ed8c_b.jpg"
  },
  {
    name: "Robot Café",
    image: "https://farm2.staticflickr.com/1401/1475297269_3082a71c04_z.jpg"
  }
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
