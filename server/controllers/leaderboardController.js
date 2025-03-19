const UserScore = require("../models/UserScore");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await UserScore.find()
      .populate("user", "username") // Fetch usernames
      .sort({ score: -1 }) // Sort by highest score
      .limit(10); // Show top 10 scores

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// -------------

// const UserScore = require("../models/UserScore");
// const User = require("../models/User");

// // ✅ Fetch Leaderboard (Top 10 Scores)
// exports.getLeaderboard = async (req, res) => {
//   try {
//     const leaderboard = await UserScore.find()
//       .populate("user", "username") // Fetch username
//       .sort({ score: -1 }) // Sort by highest score
//       .limit(10); // Show top 10 scores

//     res.json(leaderboard);
//   } catch (error) {
//     console.error("Leaderboard Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

