# Evangadi Forum — Backend

REST API for the Evangadi Forum application. Built with Node.js, Express, and MySQL.

## Tech Stack
- Node.js / Express 5
- MySQL (mysql2)
- JWT (jsonwebtoken) for auth
- bcrypt for password hashing

## Folder structure
```
app.js
db/dbConfig.js
routes/
  userRoute.js  questionRoute.js  answerRoute.js
  controller/
    userController.js  questionController.js  answerController.js
    middleWare/authmiddleware.js
schema.sql
```

## Environment Variables
Copy `.env.example` to `.env` and fill it in. `DB_USER`, `DB_NAME` and `JWT_SECRET` are required.

## Getting Started
```
npm install
# create the tables
mysql -u root -p < schema.sql
npm run dev      # or: npm start
```

## API Endpoints
All routes except register and login need the header `Authorization: Bearer <token>`.

### Users
- POST /api/users/register
- POST /api/users/login
- GET  /api/users/check

### Questions
- GET  /api/questions/all-questions
- GET  /api/questions/:question_id
- POST /api/questions

### Answers
- GET  /api/answers/:question_id
- POST /api/answers

## Notes
This repo contains backend only. The frontend lives in a separate repo: evangadi-frontend.
