const express = require("express");
const Route = express.Router();
const auth = require("./../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const mongoose = require("mongoose");

//load models
const Divisi = require("./../../models/Division");

/*
@route  GET api/divisi
@desc   Get All Divisi
@access public
*/
Route.get("/", async (req, res) => {
  try {
    const divisi = await Divisi.find().populate("location", [
      "name",
      "description"
    ]);

    res.json(divisi);
  } catch (err) {
    console.log(err.message);
    res.send("Server Error");
  }
});

/*
@route  POST api/divisi
@desc   Create new divisi
@access private
*/
Route.post(
  "/",
  [
    auth,
    check("name", "Name of Division is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, tower, location } = req.body;

    const divisiFields = {};
    if (name) divisiFields.name = name;
    if (tower) divisiFields.tower = tower;
    if (location) {
      divisiFields.location = location;
    }
    mongoose.Types.ObjectId(divisiFields.location);

    try {
      let divisi = new Divisi(divisiFields);
      await divisi.save();
      res.json(divisi);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = Route;
