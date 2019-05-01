const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No Token, Authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtToken"));

    //take to req object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "No Token, Authorization failed" });
  }
};
