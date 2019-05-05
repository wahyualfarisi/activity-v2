const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  from_date: {
    type: Date,
    required: true
  },
  to_date: {
    type: Date,
    required: true
  },
  client: {
    type: String,
    required: true
  },
  divisi: {
    type: Schema.Types.ObjectId,
    ref: "divisi"
  },
  description: {
    type: String
  },
  issue: [
    {
      name: {
        type: String,
        required: true
      },
      solveProblem: [
        {
          solveName: {
            type: String,
            required: true
          }
        }
      ],
      level: {
        type: String
      }
    }
  ]
});

module.exports = Activity = mongoose.model("activity", ActivitySchema);
