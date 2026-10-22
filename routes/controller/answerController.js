const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../../db/dbConfig");

const clean = (value) => (typeof value === "string" ? value.trim() : "");

async function postAnswer(req, res) {
  const body = req.body || {};
  const questionid = clean(body.questionid);
  const answer = clean(body.answer);
  const userid = req.user.userid;

  if (!questionid || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "please provide questionid and answer" });
  }
  if (answer.length > 200) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "answer must be 200 characters or less" });
  }

  try {
    // make sure the question exists (otherwise the foreign key fails with a 500)
    const [question] = await dbConnection.query(
      "SELECT questionid FROM questions WHERE questionid = ?",
      [questionid]
    );
    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "question not found" });
    }

    await dbConnection.execute(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [userid, questionid, answer]
    );

    return res.status(StatusCodes.CREATED).json({ msg: "answer posted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong, please try again later" });
  }
}

async function getAnswers(req, res) {
  const { question_id } = req.params;

  try {
    const [answers] = await dbConnection.query(
      `SELECT a.answerid, a.answer, u.username
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.questionid = ?
       ORDER BY a.answerid DESC`,
      [question_id]
    );

    return res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong, please try again later" });
  }
}

module.exports = { postAnswer, getAnswers };
