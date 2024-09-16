const express = require("express");
const axios = require("axios"); // Import axios for HTTP requests
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new users
public_users.post("/register", (req, res) => {
  let user = req.body.username;
  let pass = req.body.password;
  if (!user || !pass) {
    return res.status(404).json({ message: "Invalid details" });
  }
  users.push({ username: user, password: pass });
  return res
    .status(200)
    .json({ message: "Customer registered successfully, you can now log in" });
});

// Get the book list available in the shop using async-await
public_users.get("/", async (req, res) => {
  try {
    // Simulate asynchronous operation for fetching book list
    const bookList = await new Promise((resolve) => {
      setTimeout(() => resolve(books), 1000);
    });
    return res
      .status(200)
      .json({ message: "Books data fetched successfully", data: bookList });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching book list", error: error.message });
  }
});

// Get book details based on ISBN using async-await
public_users.get("/isbn/:isbn", async (req, res) => {
  let { isbn } = req.params;
  try {
    const bookDetails = await new Promise((resolve, reject) => {
      if (!isbn) reject("ISBN not given");
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
    return res.status(200).json({ message: "Book found", data: bookDetails });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// Get book details based on author using async-await
public_users.get("/author/:author", async (req, res) => {
  let { author } = req.params;
  try {
    const bookDetails = await new Promise((resolve) => {
      let foundBooks = Object.values(books).filter(
        (book) => book.author === author
      );
      resolve(foundBooks);
    });
    if (bookDetails.length > 0) {
      return res
        .status(200)
        .json({ message: "Books by author found", data: bookDetails });
    } else {
      return res.status(400).json({ message: "Author not found" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by author",
      error: error.message,
    });
  }
});

// Get book details based on title using async-await and axios
public_users.get("/title/:title", async (req, res) => {
  let { title } = req.params;
  try {
    const bookDetails = await new Promise((resolve) => {
      let foundBooks = Object.values(books).filter(
        (book) => book.title === title
      );
      resolve(foundBooks);
    });
    return res
      .status(200)
      .json({ message: "Books by title found", data: bookDetails.data });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Title not found", error: error.message });
  }
});
// Get book review using async-await
public_users.get("/review/:isbn", async (req, res) => {
  let { isbn } = req.params;
  try {
    const bookReview = await new Promise((resolve, reject) => {
      if (!isbn) reject("ISBN not given");
      if (books[isbn]) resolve(books[isbn].reviews);
      else reject("Book not found");
    });
    return res.status(200).json({ message: "Book found", data: bookReview });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports.general = public_users;
