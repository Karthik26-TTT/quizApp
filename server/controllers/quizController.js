const UserScore = require("../models/UserScore"); 
const Quiz = require("../models/Quiz.js");

const User = require("../models/User");


exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await UserScore.find()
      .populate("user", "username") 
      .sort({ score: -1 }) 
      .limit(10); 

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard Fetch Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Title and questions are required" });
    }

    const quiz = new Quiz({
      title,
      questions,
      createdBy: req.user.id, 
    });

    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Quiz Creation Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "username");
    res.json(quizzes);
  } catch (error) {
    console.error("Fetch Quizzes Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "createdBy",
      "username"
    );
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (error) {
    console.error("Fetch Quiz by ID Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a quiz (Admin only)
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Delete Quiz Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// submit   .

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user.id; // Get user ID from token

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) {
        score += 1; // Increase score for each correct answer
      }
    });

    // Save score in the database
    const userScore = new UserScore({ user: userId, quiz: quizId, score });
    await userScore.save();

    res.json({ message: "Quiz submitted!", score });
  } catch (error) {
    console.error("Quiz Submission Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
