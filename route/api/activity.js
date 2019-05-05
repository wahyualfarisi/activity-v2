const express = require("express");
const Route = express.Router();
const { check, validationResult } = require("express-validator/check");

//load auth middleware
const auth = require("./../../middleware/auth");
//load models activity
const Activity = require("./../../models/Activity");
//load models users
const User = require("./../../models/User");

/*
@route  GET api/divisi/test
@desc   Test Route Divisi
@access public
*/
Route.get("/test", (req, res) => {
  res.send("activity route is working properly");
});

/*
@route  POST api/activity
@desc   Create new activity
@access private
*/
Route.post(
  "/",
  [
    auth,
    check("title", "Title is required")
      .not()
      .isEmpty(),
    check("from_date", "From date is required")
      .not()
      .isEmpty(),
    check("to_date", "To Date is Required")
      .not()
      .isEmpty(),
    check("client", "Name Of Client is required")
      .not()
      .isEmpty(),
    check("divisi", "ID Of Divisi is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    //check user from token
    const currentUser = await User.findOne({ _id: req.user.id });
    if (!currentUser) return res.status(401).json({ msg: "No Authorization" });

    const { title, from_date, to_date, client, divisi, description } = req.body;

    const newActivity = {
      title,
      from_date,
      to_date,
      client,
      divisi,
      description
    };

    try {
      const activity = new Activity(newActivity);
      await activity.save();
      res.json(activity);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/*
@route  POST api/activity/issue/:activity_id
@desc   Create issue on activity
@access private
*/
Route.post(
  "/issue/:activity_id",
  [
    auth,
    check("name", "Name is Required")
      .not()
      .isEmpty(),
    check("solve_name", "Solve Name is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    //check for token
    const currentUser = await User.findOne({ _id: req.user.id });
    if (!currentUser)
      return res.status(401).json({ msg: "Authorization Failed" });

    const { name, solve_name, level } = req.body;

    const issueFields = {};
    if (name) issueFields.name = name;
    if (level) issueFields.level = level;

    issueFields.solveProblem = [];

    if (solve_name.length > 0) {
      solve_name.map(solve => {
        return issueFields.solveProblem.push({ solveName: solve.name });
      });
    }

    try {
      const activity = await Activity.findOne({ _id: req.params.activity_id });

      activity.issue.unshift(issueFields);

      await activity.save();

      res.json(activity);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/*
@route  DELETE api/activity/issue/:activity_id/:issue_id
@desc   Delete Issue with :issue_id && activity with activity_id
@access private
*/
Route.delete("/issue/:activity_id/:issue_id", auth, async (req, res) => {
  const currentUser = await User.findOne({ _id: req.user.id });

  if (!currentUser)
    return res.status(401).json({ msg: "Authorization Failed" });

  try {
    const activity = await Activity.findOne({ _id: req.params.activity_id });
    const removeIndex = activity.issue
      .map(item => item.id)
      .indexOf(req.params.issue_id);
    console.log(removeIndex);
    if (removeIndex === -1)
      return res.status(400).json({ msg: "Issue Not Found" });

    activity.issue.splice(removeIndex, 1);
    await activity.save();
    res.json({ msg: "issue deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

/*
@route  GET api/activity
@desc   get all activity
@access private
*/
Route.get("/", auth, async (req, res) => {
  const currentUser = await User.findOne({ _id: req.user.id });
  if (!currentUser)
    return res.status(401).json({ msg: "Authorization failed" });

  try {
    const activity = await Activity.find().populate("divisi", [
      "location",
      "name",
      "tower"
    ]);
    res.json(activity);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = Route;
