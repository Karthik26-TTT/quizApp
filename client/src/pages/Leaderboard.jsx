import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/leaderboard.css";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access Denied! Admins Only.");
      navigate("/quiz"); 
    }

    let storedScores = JSON.parse(localStorage.getItem("quizScores")) || [];

 
    const uniqueScores = storedScores.reduce((acc, current) => {
      if (!acc.find((entry) => entry.username === current.username && entry.score === current.score)) {
        acc.push(current);
      }
      return acc;
    }, []);


    setScores(uniqueScores.sort((a, b) => b.score - a.score));
    localStorage.setItem("quizScores", JSON.stringify(uniqueScores));

  }, [navigate]);
  
  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      {scores.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.username}</td>
                <td>
                  {entry.score} / {entry.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No scores available yet.</p>
      )}

    
      <button
        onClick={() => navigate("/list")}
        style={{
          display: "block",
          margin: "20px auto",
          padding: "15px 25px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "white",
          background: "linear-gradient(135deg, #ff7eb3, #ff758c)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          transition: "0.3s",
        }}
        onMouseOver={(e) =>
          (e.target.style.background =
            "linear-gradient(135deg, #ff758c, #ff7eb3)")
        }
        onMouseOut={(e) =>
          (e.target.style.background =
            "linear-gradient(135deg, #ff7eb3, #ff758c)")
        }
      >
        🚀 Start Quiz
      </button>
    </div>
  );
}

export default Leaderboard;
