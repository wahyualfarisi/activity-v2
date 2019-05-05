const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");
const PORT = process.env.PORT || 5000;

//connected to DB
connectDB();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "public"));
app.use(express.static(__dirname + "/assets"));
app.use(express.static(__dirname + "/assets/css"));
app.use(express.static(__dirname + "/assets/js"));
app.set("view engine", "ejs");

//define route system
app.use("/", require("./route/login"));
app.use("/home", require("./route/home"));

//define route API
app.use("/api/login", require("./route/api/login"));
app.use("/api/user", require("./route/api/user"));
app.use("/api/location", require("./route/api/location"));
app.use("/api/divisi", require("./route/api/division"));
app.use("/api/activity", require("./route/api/activity"));

app.listen(PORT, () => {
  console.log("Server is running ");
});
