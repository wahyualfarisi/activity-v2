const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

//connected to DB
connectDB();

app.get("/", (req, res) => {
  res.send("<h1> Hello World </h1>");
});

app.use(express.json({ extended: false }));

//define route API
app.use("/api/login", require("./route/api/login"));
app.use("/api/user", require("./route/api/user"));
app.use("/api/location", require("./route/api/location"));

app.listen(PORT, () => {
  console.log("Server is running ");
});
