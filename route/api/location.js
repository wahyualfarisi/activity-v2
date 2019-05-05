const express = require("express");
const Route = express.Router();
const auth = require("./../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

//load location models
const Location = require("./../../models/Location");

/*
@route  POST api/location
@desc   create new location
@access private
*/
Route.post(
  "/",
  [
    auth,
    check("name", "Name of Location is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const LocationFields = {};
    LocationFields.name = name;
    if (description) LocationFields.description = description;

    try {
      const location = new Location(LocationFields);
      await location.save();
      res.json(location);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/*
@route  GET api/location
@desc   get all location
@access public
*/
Route.get("/", async (req, res) => {
  try {
    const location = await Location.find();
    res.json(location);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

/*
@route  PATCH api/location/:location_id
@desc   Edit Location
@access private
*/
Route.patch(
  "/:location_id",
  [
    auth,
    check("name", "Name Of Location is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, description } = req.body;
    const LocationFields = {};
    LocationFields.name = name;
    if (description) LocationFields.description = description;

    try {
      const location = await Location.findOneAndUpdate(
        { _id: req.params.location_id },
        { $set: LocationFields },
        { new: true }
      );
      res.json(location);
    } catch (err) {
      console.log(err.message);
      if (err.kind === "ObjectId")
        return res.status(400).json({ msg: "Location Id Not Found" });
      res.status(500).send("Server Error");
    }
  }
);

module.exports = Route;
