const express = require("express");
const router = express.Router();

const authMiddleware = require("./controller/middleWare/authmiddleware");
const { postAnswer, getAnswers } = require("./controller/answerController");

router.post("/", authMiddleware, postAnswer);
router.get("/:question_id", authMiddleware, getAnswers);

module.exports = router;
