const Book = require("../models/bookModel");

const bookController = {
  createBook: async (req, res, next) => {
    try {
      
      const { title, author, isbn, category, totalCopies, availableCopies } = req.body;

      if (!title || !author || !isbn || !category || totalCopies === undefined || availableCopies === undefined) throw new Error("All fields are required");
      
      if (totalCopies < 0 || availableCopies < 0) throw new Error("Copies count cannot be negative");
      

      if (availableCopies > totalCopies) throw new Error("Available copies cannot exceed total copies");

      const existingBook = await Book.findOne({ isbn });

      if (existingBook) throw new Error("ISBN must be unique");

      const book = await Book.create(req.body);
      res.status(201).json(book);

    } catch (err) {
      next(err);
    }
  },

  getAllBooks: async (req, res, next) => {
    try {
      const { search, category, available } = req.query;
      const filter = {};

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
          { isbn: { $regex: search, $options: "i" } }
        ];
      }

      if (category) {
        filter.category = { $regex: `^${category}$`, $options: "i" };
      }

      if (available === "true") {
        filter.availableCopies = { $gt: 0 };
      } else if (available === "false") {
        filter.availableCopies = 0;
      }

      const books = await Book.find(filter);
      res.status(200).json(books);
    } catch (err) {
      next(err);
    }
  },

  getBookById: async (req, res, next) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        throw new Error("Book not found");
      }
      res.status(200).json(book);
    } catch (err) {
      next(err);
    }
  },

  updateBook: async (req, res, next) => {
    try {
      const existingBook = await Book.findById(req.params.id);
      if (!existingBook) {
        throw new Error("Book not found");
      }

      const total = req.body.totalCopies !== undefined ? req.body.totalCopies : existingBook.totalCopies;
      const available = req.body.availableCopies !== undefined ? req.body.availableCopies : existingBook.availableCopies;

      if (total < 0 || available < 0) {
        throw new Error("Copies count cannot be negative");
      }

      if (available > total) {
        throw new Error("Available copies cannot exceed total copies");
      }

      if (req.body.isbn && req.body.isbn !== existingBook.isbn) {
        const duplicate = await Book.findOne({ isbn: req.body.isbn });
        if (duplicate) {
          throw new Error("ISBN must be unique");
        }
      }

      const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      res.status(200).json(book);
    } catch (err) {
      next(err);
    }
  },

  deleteBook: async (req, res, next) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        throw new Error("Book not found");
      }
      res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = bookController;
