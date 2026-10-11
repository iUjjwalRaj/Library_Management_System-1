const mongoose = require("mongoose");
const Transaction = require("../Model/TranscationModel");
const Book = require("../models/bookModel");

// Admin manual issue endpoint
const issueBook = async (req, res) => {
  const { bookId, userId, dueDate } = req.body;

  if (!bookId || !userId || !dueDate) {
    return res.status(400).json({ message: "Book ID, user ID and due date are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid book ID format" });
  }

  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.availableCopies <= 0) {
    return res.status(400).json({ message: "No copies available" });
  }

  const transaction = new Transaction({
    book: bookId,
    user: userId,
    dueDate,
    status: "Issued",
    issuedDate: new Date(),
  });
  await transaction.save();

  book.availableCopies -= 1;
  await book.save();

  res.status(201).json({ message: "Book issued successfully", transaction });
};

// Student self-service borrow endpoint
const borrowBook = async (req, res) => {
  const { bookId, days } = req.body;

  if (!bookId) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid book ID format" });
  }

  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.availableCopies <= 0) {
    return res.status(400).json({ message: "No copies available" });
  }

  const loanDays = days && !isNaN(days) ? parseInt(days, 10) : 14;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + loanDays);

  const transaction = new Transaction({
    book: bookId,
    user: req.user.userId,
    dueDate,
    status: "Issued",
    issuedDate: new Date(),
  });
  await transaction.save();

  book.availableCopies -= 1;
  await book.save();

  res.status(201).json({
    message: "Book borrowed successfully",
    transaction,
    book: {
      _id: book._id,
      title: book.title,
      availableCopies: book.availableCopies,
    },
  });
};

// Get current student's active and past loans
const getMyLoans = async (req, res) => {
  try {
    const loans = await Transaction.find({ user: req.user.userId }).sort({ issuedDate: -1 });

    const validBookIds = loans
      .map((l) => l.book)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const books = await Book.find({ _id: { $in: validBookIds } });
    const bookMap = {};
    books.forEach((b) => {
      bookMap[b._id.toString()] = b;
    });

    const enrichedLoans = loans.map((loan) => {
      const bookDetails = bookMap[loan.book];
      return {
        _id: loan._id,
        bookId: loan.book,
        bookTitle: bookDetails ? bookDetails.title : "Unknown Title",
        bookAuthor: bookDetails ? bookDetails.author : "Unknown Author",
        category: bookDetails ? bookDetails.category : "",
        issuedDate: loan.issuedDate,
        dueDate: loan.dueDate,
        returndate: loan.returndate,
        status: loan.status,
      };
    });

    res.json({ loans: enrichedLoans });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve loans", error: err.message });
  }
};

// Return book endpoint (accessible to the student who borrowed it, or an admin)
const returnBook = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid transaction ID format" });
  }

  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  // Authorization check: student can only return their own loan; admin can return any loan
  if (req.user.role !== "admin" && transaction.user !== req.user.userId) {
    return res.status(403).json({ message: "You do not have permission to return this book" });
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

module.exports = {
  issueBook,
  borrowBook,
  getMyLoans,
  returnBook,
};
