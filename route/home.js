const express = require("express");
const Route = express.Router();

Route.get("/", (req, res) => {
  res.render("home");
});

module.exports = Route;
