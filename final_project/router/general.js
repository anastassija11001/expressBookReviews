const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register/:username/:password", (req,res) => {
  //Write your code here
  const {username, password} = req.params;
    if (!username || !password) {
        return res.status(400).json({ message: "Требуются имя пользователя и пароль" });
    }
    if (users[username]) {
        return res.status(400).json({ message: "Пользователь уже существует" });
    }
    users[username] = { password };
    return res.status(201).json({ message: "Пользователь успешно зарегистрирован" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Книга не найдена" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
    const results = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({ message: "Книги этого автора не найдены" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
    const results = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({ message: "Книг с таким названием не найдено" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Для этой книги не найдено ни одного отзыва" });
    }
});

module.exports.general = public_users;
