const Questions = require("../models/stage2Result");

var aiMax = 45;
var swMax = 25;

exports.getS2Result = async (req, res) => {
  const userAnswered = await Questions.findOne({
    "questions.userEmail": req.session.userEmail || "not working",
  });

  if (userAnswered) {
    var ai =
      ((userAnswered.questions[0].aiWeight / aiMax) * 100)
        .toString()
        .substring(0, 4) + "%";
    var sw =
      ((userAnswered.questions[0].swWeight / swMax) * 100)
        .toString()
        .substring(0, 4) + "%";
    res.render("stage2Result", { ai: ai, sw: sw });
  } else {
    res.redirect("/stage2Result");
  }
};
