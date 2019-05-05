const express = require("express");
const Route = express.Router();
const bcrypt = require("bcryptjs");

//load user
const User = require("./../models/User");

Route.get("/", (req, res) => {
  res.render("login", {
    title: "Login"
  });
});

Route.get("/redirect", (req, res) => {
  res.redirect("/home");
});

module.exports = Route;
