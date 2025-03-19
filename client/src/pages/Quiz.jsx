import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizById } from "../api/quizapi";
import "../styles/Quiz.css";

function Quiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const data = await getQuizById(quizId);
        if (!data || !data.questions) throw new Error("Quiz data not found");
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setQuiz({ title: "Error", questions: [] });
      }
    }
    fetchQuiz();
  }, [quizId]);

  if (!quiz) return <p>Loading quiz...</p>;
  if (!quiz.questions.length)
    return <p>Error loading quiz. Please try again.</p>;

  const questions = quiz.questions;

  if (quizCompleted) {
    const username = localStorage.getItem("username") || "Guest";
    const existingScores = JSON.parse(localStorage.getItem("quizScores")) || [];
    existingScores.push({ username, score, total: questions.length });

    localStorage.setItem("quizScores", JSON.stringify(existingScores));

    return (
      <div className="quiz-container">
        <h2>Quiz Completed!</h2>
        <p>
          Your Score: {score} / {questions.length}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="restart-btn"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
    if (option === currentQuestion.correctAnswer) {
      setFeedback("✅ Correct!");
      setScore(score + 1);
    } else {
      setFeedback(
        `❌ Incorrect! The correct answer is: ${currentQuestion.correctAnswer}`
      );
    }
  };

  const handleNextQuestion = () => {
    setFeedback("");
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="quiz-container">
      <h2>{quiz.title}</h2>
      <p>
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>
      <h3>{currentQuestion.questionText}</h3>
      <ul className="options-list">
        {currentQuestion.options.map((option, index) => (
          <li
            key={index}
            className={`option ${selectedAnswer === option ? "selected" : ""}`}
            onClick={() => handleAnswerSelect(option)}
            disabled={selectedAnswer}
          >
            {option}
          </li>
        ))}
      </ul>

      {feedback && <p className="feedback">{feedback}</p>}

      <button
        onClick={handleNextQuestion}
        disabled={!selectedAnswer}
        className="next-btn"
      >
        {currentQuestionIndex === questions.length - 1
          ? "Finish Quiz"
          : "Next Question"}
      </button>
    </div>
  );
}

export default Quiz;
