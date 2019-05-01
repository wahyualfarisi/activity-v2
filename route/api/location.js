const express = require("express");
const Route = express.Router();

/*
@route  GET api/location
@desc   get all location
@access private
*/

Route.get("/", (req, res) => {
  res.send("Api/location/ work");
});

module.exports = Route;
