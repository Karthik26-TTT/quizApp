const express = require("express");
const {
  createQuiz,
  getQuizzes,
  getQuizById,
  deleteQuiz,
} = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new quiz (only for authenticated users)
router.post("/create", authMiddleware, createQuiz);


router.get("/", getQuizzes);

router.get("/:id", getQuizById)

router.delete("/:id", authMiddleware, deleteQuiz)

module.exports = router;           
