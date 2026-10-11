const express = require("express");
const router = express.Router();

const authentication = require("../Middleware/authentication");
const authorizeRooles = require("../Middleware/authorisation");
const { issueBook, returnBook } = require("../controllers/circulationController");

router.post("/issue", authentication, authorizeRooles("admin"), issueBook);
router.post("/return/:id", authentication, authorizeRooles("admin"), returnBook);

module.exports = router;
