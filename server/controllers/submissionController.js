const Submission = require("../models/Submission");
const Quiz = require("../models/Quiz");
const jwt = require("jsonwebtoken");

exports.submitQuiz = async (req, res) => {
  try {
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;         

    const { quizId, answers } = req.body;

    if (!quizId || !answers || answers.length === 0) {
      return res.status(400).json({ message: "Quiz ID and answers are required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

   
    let score = 0;
    answers.forEach((answer) => {
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId.toString()
      );
      if (question && question.correctAnswer === answer.selectedOption) {
        score++;
      }
    });

  
    const newSubmission = new Submission({
      quizId,
      userId,
      answers,
      score,
    });
    
    await newSubmission.save()
      .then(() => console.log("✅ Submission saved successfully"))
      .catch((err) => console.error("❌ Submission save error:", err));
    

    await newSubmission.save();

    res.status(201).json({ message: "Quiz submitted successfully", score });
  } catch (error) {
    console.error("Submit Quiz Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
