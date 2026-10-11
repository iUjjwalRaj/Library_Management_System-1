const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authentication = require("../Middleware/authentication");
const authorizeRooles = require("../Middleware/authorisation");

// Anyone can view books
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);

// Only logged-in admins can add, edit, or delete books
router.post("/", authentication, authorizeRooles("admin"), bookController.createBook);
router.put("/:id", authentication, authorizeRooles("admin"), bookController.updateBook);
router.delete("/:id", authentication, authorizeRooles("admin"), bookController.deleteBook);

module.exports = router;
