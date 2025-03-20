import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MoonIcon,
  SunIcon,
  TrophyIcon,
  LogOutIcon,
  BookOpenIcon,
} from "lucide-react";
import "../styles/Quizlist.css";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categoryImages = [];
  const defaultImage = "/placeholder.svg?height=200&width=300";

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));

    if (newMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const getQuizImage = (quizTitle) => {
    const matchedCategory = categoryImages.find((item) =>
      quizTitle.toLowerCase().includes(item.category.toLowerCase())
    );
    return matchedCategory ? matchedCategory.image : defaultImage;
  };

  const getCategories = () => {
    if (!quizzes.length) return ["All"];

    const categories = quizzes.map((quiz) => {
      const matchedCategory = categoryImages.find((item) =>
        quiz.title.toLowerCase().includes(item.category.toLowerCase())
      );
      return matchedCategory ? matchedCategory.category : "Other";
    });

    return ["All", ...new Set(categories)];
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.description &&
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())); // Fix applied here

    const matchesCategory =
      selectedCategory === "All" ||
      quiz.title.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      const isDarkMode = JSON.parse(savedDarkMode);
      setDarkMode(isDarkMode);
      if (isDarkMode) {
        document.body.classList.add("dark");
      }
    }

    setLoading(true);
    axios
      .get("https://quizapp-api-xqkk.onrender.com/api/quiz")
      .then((response) => {
        setQuizzes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className={`quiz-app-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <BookOpenIcon className="brand-icon" />
          <h1 className="logo" onClick={() => navigate("/")}>
            QuizMaster
          </h1>
        </div>

        <div className="nav-links">
          <div
            className="nav-item results-link"
            onClick={() => navigate("/leaderboard")}
          >
            <TrophyIcon size={18} />
            <span>LeaderBoard</span>
          </div>

          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          <button className="login-btn" onClick={() => navigate("/")}>
            <LogOutIcon size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Test Your Knowledge</h1>
          <p className="hero-subtitle">
            Challenge yourself with our collection of quizzes across various
            topics..
          </p>
        </div>
      </div>

      {/* Quiz List Section */}
      <div className="quiz-container">
        <div className="quiz-header">
          <h2 className="heading">Available Quizzes</h2>
          <p className="subheading">Select a quiz to test your knowledge</p>

          <div className="filter-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {getCategories().map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading quizzes...</p>
          </div>
        ) : (
          <div className="quiz-grid">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <div key={quiz._id} className="quiz-card">
                  <div
                    className="quiz-image"
                    style={{
                      backgroundImage: `url(${getQuizImage(quiz.title)})`,
                    }}
                  >
                    <div className="quiz-difficulty">
                      {quiz.difficulty || "Medium"}
                    </div>
                  </div>

                  <div className="quiz-content">
                    <div className="quiz-title">{quiz.title}</div>
                    <p className="quiz-description">{quiz.description}</p>

                    <div className="quiz-meta">
                      <span className="quiz-questions">
                        {Array.isArray(quiz.questions)
                          ? `${quiz.questions.length} questions`
                          : "No questions available"}
                      </span>
                      <span className="quiz-time">
                        {Math.round((quiz.questions?.length || 0) * 0.5)} min
                      </span>
                    </div>

                    <button
                      className="start-btn"
                      onClick={() => navigate(`/quiz/${quiz._id}`)}
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-quizzes">
                <p>No quizzes found matching your search</p>
                <button
                  className="reset-search-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>QuizMaster</h2>
            <p className="test">Test your knowledge and challenge yourself</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li onClick={() => navigate("/")}>Home</li>
                <li onClick={() => navigate("/leaderboard")}>My Results</li>
                <li onClick={() => navigate("/")}>Login</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuizList;
