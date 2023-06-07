const express = require("express");
const router = express.Router();
const User = require("./models/user");
const Stage1Questions = require("./models/stage1Questions");

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select(
      "email full_name gender student_id enrolled github_account"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/values", async (req, res) => {
  try {
    const values = await Stage1Questions.find({}).select("questions");
    res.json(values);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
