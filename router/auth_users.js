const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = require("./users.js");

const isValid = (username) => {
  // Check if the username exists
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Check if username and password match the records
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Only registered users can log in
regd_users.post("/login", (req, res) => {
  let { username, password } = req.body;

  if (authenticatedUser(username, password)) {
    const sessionToken = jwt.sign({ username }, "secret", { expiresIn: "1h" });
    req.session.authorization = { username, accessToken: sessionToken };
    return res.status(200).json({
      message: "Customer successfully logged in",
      accessToken: sessionToken,
    });
  } else {
    return res
      .status(401)
      .json({ message: "Invalid login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let { isbn } = req.params;
  let { review } = req.body;

  if (!isbn || !review)
    return res.status(400).json({ message: "ISBN or review not provided" });

  if (books[isbn]) {
    if (!books[isbn].reviews) {
      books[isbn].reviews = [];
    }
    books[isbn].reviews = review;
    return res
      .status(200)
      .json({ message: "Review published", data: books[isbn] });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let { isbn } = req.params;

  if (!isbn) return res.status(400).json({ message: "ISBN not provided" });

  if (books[isbn]) {
    books[isbn].reviews = []; // Clear all reviews
    return res
      .status(200)
      .json({ message: "Reviews deleted", data: books[isbn] });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
