const mongoose = require("mongoose");

const cafeSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

module.exports = mongoose.model("Cafe", cafeSchema);
