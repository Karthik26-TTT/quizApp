const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      selectedOption: { type: String, required: true },
    },
  ],
  score: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Submission", SubmissionSchema);
