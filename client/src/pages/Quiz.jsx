"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getQuizById } from "../api/quizapi"
import "../styles/quiz.css"

function Quiz() {
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerActive, setIsTimerActive] = useState(true)

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const data = await getQuizById(quizId)
        if (!data || !data.questions) throw new Error("Quiz data not found")
        setQuiz(data)
      } catch (error) {
        console.error("Error fetching quiz:", error)
        setQuiz({ title: "Error", questions: [] })
      }
    }
    fetchQuiz()
  }, [quizId])

  // Timer effect
  useEffect(() => {
    let timer
    if (isTimerActive && timeLeft > 0 && !feedback) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && !feedback) {
      handleTimeUp()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, isTimerActive, feedback])

  const handleTimeUp = () => {
    setFeedback(`⏱️ Time's up! The correct answer is: ${quiz.questions[currentQuestionIndex].correctAnswer}`)
    setIsTimerActive(false)
  }

  if (!quiz)
    return (
      <div className="quiz-loading">
        <div className="spinner"></div>
        <p>Loading quiz...</p>
      </div>
    )

  if (!quiz.questions.length) return <div className="quiz-error">Error loading quiz. Please try again.</div>

  const questions = quiz.questions

  if (quizCompleted) {
    const username = localStorage.getItem("username") || "Guest"
    const existingScores = JSON.parse(localStorage.getItem("quizScores")) || []
    existingScores.push({ username, score, total: questions.length })

    localStorage.setItem("quizScores", JSON.stringify(existingScores))

    const percentage = Math.round((score / questions.length) * 100)
    let resultMessage = ""

    if (percentage >= 80) {
      resultMessage = "Excellent! You're a quiz master!"
    } else if (percentage >= 60) {
      resultMessage = "Good job! You know your stuff!"
    } else if (percentage >= 40) {
      resultMessage = "Not bad! Keep learning!"
    } else {
      resultMessage = "Keep practicing! You'll get better!"
    }

    return (
      <div className="quiz-container results-container">
        <div className="confetti-animation"></div>
        <h2>Quiz Completed!</h2>
        <div className="score-circle">
          <div className="score-number">{score}</div>
          <div className="score-divider"></div>
          <div className="score-total">{questions.length}</div>
        </div>
        <p className="result-message">{resultMessage}</p>
        <button onClick={() => window.location.reload()} className="restart-btn">
          Restart Quiz
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = (currentQuestionIndex / questions.length) * 100

  const handleAnswerSelect = (option) => {
    if (selectedAnswer || feedback) return // Prevent selecting after answer is chosen

    setSelectedAnswer(option)
    setIsTimerActive(false)

    if (option === currentQuestion.correctAnswer) {
      setFeedback("✅ Correct!")
      setScore(score + 1)
    } else {
      setFeedback(`❌ Incorrect! The correct answer is: ${currentQuestion.correctAnswer}`)
    }
  }

  const handleNextQuestion = () => {
    setFeedback("")
    setSelectedAnswer(null)
    setTimeLeft(30)
    setIsTimerActive(true)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className="quiz-progress-container">
          <div className="quiz-progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="timer-container">
        <div className="timer-bar">
          <div
            className="timer-fill"
            style={{
              width: `${(timeLeft / 30) * 100}%`,
              backgroundColor: timeLeft < 10 ? "#ff4d4d" : "#4caf50",
            }}
          ></div>
        </div>
        <div className="timer-text">{timeLeft}s</div>
      </div>

      <div className="question-card">
        <h3>{currentQuestion.questionText}</h3>
        <ul className="options-list">
          {currentQuestion.options.map((option, index) => {
            let optionClass = "option"

            if (feedback) {
              if (option === currentQuestion.correctAnswer) {
                optionClass += " correct"
              } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                optionClass += " incorrect"
              }
            } else if (selectedAnswer === option) {
              optionClass += " selected"
            }

            return (
              <li key={index} className={optionClass} onClick={() => handleAnswerSelect(option)}>
                <div className="option-letter">{String.fromCharCode(65 + index)}</div>
                <div className="option-text">{option}</div>
              </li>
            )
          })}
        </ul>
      </div>

      {feedback && (
        <div className={`feedback ${feedback.includes("Correct") ? "correct-feedback" : "incorrect-feedback"}`}>
          {feedback}
        </div>
      )}

      <button onClick={handleNextQuestion} disabled={!selectedAnswer && !feedback} className="next-btn">
        {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
      </button>
    </div>
  )
}

export default Quiz

