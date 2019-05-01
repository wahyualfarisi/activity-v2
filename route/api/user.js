const express = require("express");
const Route = express.Router();
const gravatar = require("gravatar");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator/check");

//load middleware
const auth = require("./../../middleware/auth");

//load user model
const User = require("./../../models/User");

/**
 * @route GET api/user
 * @desc  get current user
 * @access private
 */
Route.get("/", (req, res) => {
  res.send("Api/user work");
});

/**
 * @route POST api/user
 * @desc  register new user
 * @access public
 */
Route.post(
  "/",
  [
    check("name", "Name is Required")
      .not()
      .isEmpty(),
    check("email", "Email incorrect , please check your email").isEmail(),
    check(
      "password",
      "Password enter password with 6 or more characters "
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    //check errors if is exists
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    try {
      //bringing user to check email on db

      let user = await User.findOne({ email });

      //if user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Already Exist" }] });
      }

      //get Gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      //user model constructor
      user = new User({
        name,
        email,
        avatar,
        password
      });

      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save to mongodb
      user.save();

      //returning jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

/**
 * @route GET api/user/me
 * @desc  get current user
 * @access private
 */
Route.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = Route;
