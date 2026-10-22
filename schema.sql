CREATE DATABASE IF NOT EXISTS `evangadi-db` CHARACTER SET utf8mb4;
USE `evangadi-db`;

CREATE TABLE IF NOT EXISTS users (
  userid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  firstname VARCHAR(20) NOT NULL,
  lastname VARCHAR(20) NOT NULL,
  email VARCHAR(40) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  questionid VARCHAR(100) NOT NULL UNIQUE,
  userid INT NOT NULL,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  tag VARCHAR(20) DEFAULT NULL,
  FOREIGN KEY (userid) REFERENCES users(userid)
);

CREATE TABLE IF NOT EXISTS answers (
  answerid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userid INT NOT NULL,
  questionid VARCHAR(100) NOT NULL,
  answer VARCHAR(200) NOT NULL,
  FOREIGN KEY (questionid) REFERENCES questions(questionid),
  FOREIGN KEY (userid) REFERENCES users(userid)
);

-- Already have the tables? Just add the missing unique keys:
-- ALTER TABLE users ADD UNIQUE (username), ADD UNIQUE (email);
