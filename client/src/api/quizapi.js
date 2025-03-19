import axios from "axios";

const API_URL = "http://localhost:5000/api/quiz"; // Quiz API Endpoint

export const getQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${API_URL}/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return null;
  }
};


