const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
}

regd_users.post("/login/:username/:password", (req,res) => {
  const { username, password } = req.params;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Требуются имя пользователя и пароль" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
  }

  const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

  res.status(200).json({ message: "Пользователь успешно вошел в систему!", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review; 
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1]; // Get the token from the header

  if (!token) {
    return res.status(403).json({ message: "Токен не предоставлен" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Не удалось аутентифицировать токен" });
    }

    const username = decoded.username; 

    if (!review) {
      return res.status(400).json({ message: "Требуется обзор" });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
      message: `Добавлен/обновлен обзор книги с ISBN: ${isbn}`,
      reviews: books[isbn].reviews,
    });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
