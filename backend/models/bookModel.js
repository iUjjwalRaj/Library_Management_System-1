const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },
    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 1
    },
    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 0
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Book", bookSchema);
