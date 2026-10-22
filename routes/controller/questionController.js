const { StatusCodes } = require("http-status-codes");
const uniqid = require("uniqid");
const dbConnection = require("../../db/dbConfig");

const clean = (value) => (typeof value === "string" ? value.trim() : "");

async function postQuestion(req, res) {
  const body = req.body || {};
  const title = clean(body.title);
  const description = clean(body.description);
  const tag = clean(body.tag);
  const userid = req.user.userid;

  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "please provide a title and description" });
  }
  if (title.length > 50) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "title must be 50 characters or less" });
  }
  if (description.length > 200) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "description must be 200 characters or less" });
  }
  if (tag.length > 20) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "tag must be 20 characters or less" });
  }

  try {
    const questionid = uniqid();

    await dbConnection.execute(
      "INSERT INTO questions (questionid, userid, title, description, tag) VALUES (?, ?, ?, ?, ?)",
      [questionid, userid, title, description, tag || null]
    );

    return res.status(StatusCodes.CREATED).json({ msg: "question posted successfully", questionid });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong, please try again later" });
  }
}

async function getAllQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(
      `SELECT q.questionid, q.title, q.description, q.tag, u.username
       FROM questions q
       JOIN users u ON q.userid = u.userid
       ORDER BY q.id DESC`
    );

    return res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong, please try again later" });
  }
}

async function getSingleQuestion(req, res) {
  const { question_id } = req.params;

  try {
    const [rows] = await dbConnection.query(
      `SELECT q.questionid, q.title, q.description, q.tag, u.username
       FROM questions q
       JOIN users u ON q.userid = u.userid
       WHERE q.questionid = ?`,
      [question_id]
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "question not found" });
    }

    return res.status(StatusCodes.OK).json({ question: rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong, please try again later" });
  }
}

module.exports = { postQuestion, getAllQuestions, getSingleQuestion };
