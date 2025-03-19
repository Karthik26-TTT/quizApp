const express = require("express");
const { submitQuiz } = require("../controllers/submissionController");

const router = express.Router();

router.post("/submit", submitQuiz);

module.exports = router;
