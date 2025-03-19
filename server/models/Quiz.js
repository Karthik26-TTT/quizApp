// const mongoose = require("mongoose");

// const QuizSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   questions: [
//     {
//       questionText: { type: String, required: true },
//       options: [{ type: String, required: true }],
//       correctAnswer: { type: String, required: true },
//     },
//   ],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Quiz", QuizSchema);

const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [String],
      correctAnswer: { type: String, required: true }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Quiz", QuizSchema);

