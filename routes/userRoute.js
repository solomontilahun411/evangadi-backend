const express = require("express");
const router = express.Router();

const authMiddleware = require("./controller/middleWare/authmiddleware");
const { register, login, checkUser } = require("./controller/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/check", authMiddleware, checkUser);

module.exports = router;
