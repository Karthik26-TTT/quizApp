const mongoose = require("mongoose");

const UserScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, required: true }
});

module.exports = mongoose.model("UserScore", UserScoreSchema);
