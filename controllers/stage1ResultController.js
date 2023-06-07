const Stage1Result = require("../models/stage1Result");

var engineerMax = 48;
var itMax = 48;
var notItMax = 39;

exports.getS1Result = async (req, res) => {
  const userAnswered = await Stage1Result.findOne({
    "questions.userEmail": req.session.userEmail || "not working",
  });

  if (userAnswered) {
    var engineer_result =
      ((userAnswered.questions[0].totalEnginneringWeight / engineerMax) * 100)
        .toString()
        .substring(0, 4) + "%";
    var it_result =
      ((userAnswered.questions[0].totalItWeight / itMax) * 100)
        .toString()
        .substring(0, 4) + "%";
    var not_it_result =
      ((userAnswered.questions[0].totalNotItWeight / notItMax) * 100)
        .toString()
        .substring(0, 4) + "%";
    return res.render("stage1Result", {
      engineer_result: engineer_result,
      it_result: it_result,
      not_it_result: not_it_result,
    });
  } else {
    return res.redirect("/stage1");
  }
};
