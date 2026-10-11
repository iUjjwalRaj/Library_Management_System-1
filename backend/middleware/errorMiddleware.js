const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 400;
  let message = err.message || "Internal Server Error";

  if (message === "Book not found" || err.name === "CastError") {
    statusCode = 404;
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "ISBN must be unique";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  if (process.env.NODE_ENV !== "test") {
    console.error("Request error:", { method: req.method, url: req.originalUrl, message });
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
