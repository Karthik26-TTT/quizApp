import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "", role: "user" });
  const navigate = useNavigate();
  
 
  const backgroundImages = [
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920"
  ];
  
 
  const randomBgImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? "https://quizapp-api-xqkk.onrender.com/api/auth/login" : "https://quizapp-api-xqkk.onrender.com/api/auth/signup";
      const response = await axios.post(url, formData);
      
     
      const messageElement = document.createElement("div");
      messageElement.className = "success-message";
      messageElement.textContent = response.data.message;
      document.body.appendChild(messageElement);
      
      setTimeout(() => {
        document.body.removeChild(messageElement);
        if (isLogin) {
          navigate("/list");
        } else {
          setIsLogin(true);
        }
      }, 2000);
      
    } catch (error) {
      
      const messageElement = document.createElement("div");
      messageElement.className = "error-message";
      messageElement.textContent = error.response?.data?.message || "Something went wrong";
      document.body.appendChild(messageElement);
      
      setTimeout(() => {
        document.body.removeChild(messageElement);
      }, 2000);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className="login-container" style={{backgroundImage: `url(${randomBgImage})`}}>
      <div className="login-box">
        <div className="form-toggle">
          <button 
            className={isLogin ? "active" : ""} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={!isLogin ? "active" : ""} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username"
              name="username" 
              placeholder="Enter your username" 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              placeholder="Enter your password" 
              onChange={handleChange} 
              required 
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <select 
                id="role"
                name="role" 
                onChange={handleChange}
                className="role-select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          
          <button type="submit" className="submit-btn">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>
        
        <div className="login-footer">
          {isLogin ? (
            <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setIsLogin(true)}>Login</span></p>
          )}
        </div>
        
        <div className="theme-toggle">
          <button onClick={toggleDarkMode} className="theme-btn">
            Toggle Dark Mode
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
