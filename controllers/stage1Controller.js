const Stage1Result = require("../models/stage1Result");
const Stage1Questions = require("../models/stage1Questions");

exports.postStage1 = async (req, res) => {
  const { questionNumber, answerChar } = req.body;

  const engineeringWeights = await Stage1Questions.findOne({
    "questions.questionNumber": questionNumber,
  }).select("questions.answers.weight.engineeringWeight");

  const engineeringWeightsArray = engineeringWeights.questions.flatMap((q) =>
    q.answers.map((a) => a.weight.map((w) => w.engineeringWeight))
  );

  const itWeights = await Stage1Questions.findOne({
    "questions.questionNumber": questionNumber,
  }).select("questions.answers.weight.itWeight");

  const itWeightsArray = itWeights.questions.flatMap((q) =>
    q.answers.map((a) => a.weight.map((w) => w.itWeight))
  );

  const notItWeights = await Stage1Questions.findOne({
    "questions.questionNumber": questionNumber,
  }).select("questions.answers.weight.notItWeight");

  const notItWeightsArray = notItWeights.questions.flatMap((q) =>
    q.answers.map((a) => a.weight.map((w) => w.notItWeight))
  );

  const userEmail = req.session.userEmail || "not working";

  try {
    const existingQuestion = await Stage1Result.findOne({
      "questions.userEmail": userEmail,
    });

    if (existingQuestion) {
      const lastQuestionNumber = Math.max(
        ...existingQuestion.questions.map((q) => q.questionNumber)
      );
      if (questionNumber <= lastQuestionNumber) {
        // The user has already answered this question, redirect to the next question
        const nextQuestionNumber = Number(questionNumber) + 1;
        if (nextQuestionNumber === 11) {
          return res.redirect("/stage1Result");
        } else {
          return res.redirect(`/stage1?questionNumber=${nextQuestionNumber}`);
        }
      } else {
        const questionToUpdate = existingQuestion.questions.find(
          (q) => q.questionNumber === lastQuestionNumber
        );
        questionToUpdate.questionNumber = questionNumber;
        questionToUpdate.totalEnginneringWeight +=
          engineeringWeightsArray[Number(answerChar) - 1][0];
        questionToUpdate.totalItWeight +=
          itWeightsArray[Number(answerChar) - 1][0];
        questionToUpdate.totalNotItWeight +=
          notItWeightsArray[Number(answerChar) - 1][0];
        existingQuestion.save();
        return res.redirect(
          `/stage1?questionNumber=${Number(questionNumber) + 1}`
        );
      }
    } else {
      const newQuestion = new Stage1Result({
        questions: [
          {
            userEmail,
            questionNumber,
            totalEnginneringWeight:
              engineeringWeightsArray[Number(answerChar) - 1][0],
            totalItWeight: itWeightsArray[Number(answerChar) - 1][0],
            totalNotItWeight: notItWeightsArray[Number(answerChar) - 1][0],
          },
        ],
      });
      newQuestion.save();
      return res.redirect(`/stage1?questionNumber=${questionNumber}`);
    }
  } catch (error) {
    console.log(error);
    error.database = `Error saving user to database. ${error}`;
    return res.redirect(`/stage1?questionNumber=${questionNumber}`);
  }
};

exports.getStage1 = async (req, res) => {
  try {
    const isAt = await Stage1Result.findOne({
      "questions.userEmail": req.session.userEmail,
    }).select("questions.questionNumber");

    const questionNumberValue = isAt?.questions?.[0]?.questionNumber;

    const questionNumber = parseInt(questionNumberValue + 1) || 1;

    if (questionNumber >= 11) {
      return res.redirect("/stage1Result");
    }

    const questionsValue = await Stage1Questions.findOne({
      "questions.questionNumber": questionNumber,
    });
    if (!questionsValue) {
      return res.redirect("/stage1");
    }

    return res.render("stage1", {
      questionsValue: questionsValue,
      questionNumber: questionNumber,
    });
  } catch (err) {
    console.log(err);
    res.send("Error retrieving questions");
  }
};