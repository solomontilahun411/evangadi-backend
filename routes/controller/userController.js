const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../../db/dbConfig");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value) => (typeof value === "string" ? value.trim() : "");

async function register(req, res) {
  const body = req.body || {};
  const username = clean(body.username);
  const firstname = clean(body.firstname);
  const lastname = clean(body.lastname);
  const email = clean(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "please provide all required information!" });
  }

  if (username.length > 20 || firstname.length > 20 || lastname.length > 20) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "username, firstname and lastname must be 20 characters or less" });
  }

  if (!EMAIL_REGEX.test(email) || email.length > 40) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "please provide a valid email (max 40 characters)" });
  }

  if (password.length < 8 || Buffer.byteLength(password) > 72) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "password must be between 8 and 72 characters" });
  }

  try {
    const [existingUsers] = await dbConnection.execute(
      "SELECT userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbConnection.execute(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res.status(StatusCodes.CREATED).json({ msg: "user registered successfully" });
  } catch (error) {
    // two requests at the same time can pass the check above; the UNIQUE keys catch them
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "user already exists" });
    }
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong, please try again later" });
  }
}

async function login(req, res) {
  const body = req.body || {};
  const email = clean(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "please enter all required fields" });
  }

  try {
    const [users] = await dbConnection.query(
      "SELECT username, userid, password FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "invalid credential" });
    }

    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "invalid credential" });
    }

    const { username, userid } = users[0];
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(StatusCodes.OK).json({ msg: "user login successful", token, username });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong, try again later!" });
  }
}

async function checkUser(req, res) {
  const { username, userid } = req.user;
  return res.status(StatusCodes.OK).json({ msg: "valid user", username, userid });
}

module.exports = { register, login, checkUser };
