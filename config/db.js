const mongoose = require("mongoose");
const config = require("config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.get("Mlab"), {
      useNewUrlParser: true
    });
    console.log("DB connected");
  } catch (err) {
    console.log("Error To connect DB");
    process.exit(1);
  }
};

module.exports = connectDB;
