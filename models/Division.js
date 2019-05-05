const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DivisionSchema = new Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "location"
  },
  name: {
    type: String,
    required: true
  },
  tower: {
    type: String
  }
});

module.exports = Divisi = mongoose.model("divisi", DivisionSchema);
