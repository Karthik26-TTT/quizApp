import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTheme } from "./ThemeContext"; // Import useTheme
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import Leaderboard from "./pages/Leaderboard";
import QuizList from "./components/Quizlist";

function App() {
  const { darkMode } = useTheme(); // Ensure this is inside ThemeProvider

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/list" element={<QuizList />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
