const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  book: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Issued", "returned"],
    default: "Issued",
    required: true
  },
  issuedDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  returndate: {
    type: Date
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
