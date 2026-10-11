const express = require("express");
const router = express.Router();

const authentication = require("../Middleware/authentication");
const authorizeRooles = require("../Middleware/authorisation");
const {
  issueBook,
  borrowBook,
  getMyLoans,
  returnBook,
} = require("../controllers/circulationController");

// Admin manual issue
router.post("/issue", authentication, authorizeRooles("admin"), issueBook);

// Student self-service borrow
router.post("/borrow", authentication, borrowBook);

// Student loans list
router.get("/my-loans", authentication, getMyLoans);

// Return book (authorized for loan owner or admin)
router.post("/return/:id", authentication, returnBook);

module.exports = router;
