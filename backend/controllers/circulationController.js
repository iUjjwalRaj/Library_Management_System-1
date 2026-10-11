const Transaction = require("../Model/TranscationModel");
const Book = require("../models/bookModel");

const issueBook = async (req, res) => {
  const { bookId, userId, dueDate } = req.body;

  if (!bookId || !userId || !dueDate) {
    return res.status(400).json({ message: "Book ID, user ID and due date are required" });
  }

  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.availableCopies <= 0) {
    return res.status(400).json({ message: "No copies available" });
  }

  const transaction = new Transaction({ book: bookId, user: userId, dueDate });
  await transaction.save();

  book.availableCopies -= 1;
  await book.save();

  res.status(201).json({ message: "Book issued successfully", transaction });
};

const returnBook = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  if (transaction.status === "returned") {
    return res.status(400).json({ message: "Book has already been returned" });
  }

  const book = await Book.findById(transaction.book);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  transaction.status = "returned";
  transaction.returndate = Date.now();
  await transaction.save();

  book.availableCopies += 1;
  await book.save();

  res.json({ message: "Book returned successfully", transaction });
};

module.exports = { issueBook, returnBook };
