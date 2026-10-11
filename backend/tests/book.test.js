const request = require("supertest");
const app = require("../app");
const Book = require("../models/bookModel");

jest.mock("../models/bookModel");

describe("Book Management APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleBook = {
    _id: "64f1a2b3c4d5e6f7a8b9c0d1",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    category: "Programming",
    totalCopies: 10,
    availableCopies: 8
  };

  test("POST /api/books should create a new book", async () => {
    Book.findOne.mockResolvedValue(null);
    Book.create.mockResolvedValue(sampleBook);

    const res = await request(app)
      .post("/api/books")
      .send({
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        category: "Programming",
        totalCopies: 10,
        availableCopies: 8
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Clean Code");
  });

  test("POST /api/books should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({
        title: "Incomplete Book"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  test("POST /api/books should fail if availableCopies exceeds totalCopies", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({
        title: "Invalid Book",
        author: "Author",
        isbn: "1234567890",
        category: "Tech",
        totalCopies: 5,
        availableCopies: 10
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Available copies cannot exceed total copies");
  });

  test("POST /api/books should fail if duplicate ISBN is provided", async () => {
    Book.findOne.mockResolvedValue(sampleBook);

    const res = await request(app)
      .post("/api/books")
      .send({
        title: "Duplicate Book",
        author: "Author",
        isbn: "9780132350884",
        category: "Programming",
        totalCopies: 5,
        availableCopies: 5
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("ISBN must be unique");
  });

  test("GET /api/books should return all books", async () => {
    Book.find.mockResolvedValue([sampleBook]);

    const res = await request(app).get("/api/books");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test("GET /api/books with search and filters should return filtered books", async () => {
    Book.find.mockResolvedValue([sampleBook]);

    const res = await request(app)
      .get("/api/books")
      .query({ search: "Clean", category: "Programming", available: "true" });

    expect(res.statusCode).toBe(200);
    expect(Book.find).toHaveBeenCalled();
  });

  test("GET /api/books/:id should return a book by id", async () => {
    Book.findById.mockResolvedValue(sampleBook);

    const res = await request(app).get("/api/books/64f1a2b3c4d5e6f7a8b9c0d1");

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe("64f1a2b3c4d5e6f7a8b9c0d1");
  });

  test("GET /api/books/:id should return 404 for missing record", async () => {
    Book.findById.mockResolvedValue(null);

    const res = await request(app).get("/api/books/64f1a2b3c4d5e6f7a8b9c099");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Book not found");
  });

  test("PUT /api/books/:id should update an existing book", async () => {
    Book.findById.mockResolvedValue(sampleBook);
    Book.findByIdAndUpdate.mockResolvedValue({
      ...sampleBook,
      availableCopies: 7
    });

    const res = await request(app)
      .put("/api/books/64f1a2b3c4d5e6f7a8b9c0d1")
      .send({ availableCopies: 7 });

    expect(res.statusCode).toBe(200);
    expect(res.body.availableCopies).toBe(7);
  });

  test("PUT /api/books/:id should return 404 if book to update does not exist", async () => {
    Book.findById.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/books/64f1a2b3c4d5e6f7a8b9c099")
      .send({ availableCopies: 5 });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Book not found");
  });

  test("DELETE /api/books/:id should delete a book", async () => {
    Book.findByIdAndDelete.mockResolvedValue(sampleBook);

    const res = await request(app).delete("/api/books/64f1a2b3c4d5e6f7a8b9c0d1");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Book deleted successfully");
  });

  test("DELETE /api/books/:id should return 404 if book to delete does not exist", async () => {
    Book.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete("/api/books/64f1a2b3c4d5e6f7a8b9c099");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Book not found");
  });
});
