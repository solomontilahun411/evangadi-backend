const express = require("express");
const router = express.Router();

const authMiddleware = require("./controller/middleWare/authmiddleware");
const { postQuestion, getAllQuestions, getSingleQuestion } = require("./controller/questionController");

router.post("/", authMiddleware, postQuestion);
router.get("/all-questions", authMiddleware, getAllQuestions);
router.get("/:question_id", authMiddleware, getSingleQuestion);

module.exports = router;
