const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../app");
const Book = require("../models/bookModel");
const Transaction = require("../Model/TranscationModel");

jest.mock("../models/bookModel");
jest.mock("../Model/TranscationModel");

process.env.JWT_SECRET = "test_jwt_secret";

const studentToken = jwt.sign(
  { userId: "6acbc9c5618a738049a637c3", role: "user" },
  process.env.JWT_SECRET
);

const adminToken = jwt.sign(
  { userId: "6acbc9c5618a738049a637c4", role: "admin" },
  process.env.JWT_SECRET
);

const otherStudentToken = jwt.sign(
  { userId: "6acbc9c5618a738049a637c5", role: "user" },
  process.env.JWT_SECRET
);

describe("Circulation APIs (Student Borrow & Return)", () => {
  const validBookId = new mongoose.Types.ObjectId().toString();
  const validTxId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/circulation/borrow", () => {
    test("should reject unauthenticated requests with 401", async () => {
      const res = await request(app)
        .post("/api/circulation/borrow")
        .send({ bookId: validBookId });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Authentication required");
    });

    test("should fail if bookId is missing", async () => {
      const res = await request(app)
        .post("/api/circulation/borrow")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Book ID is required");
    });

    test("should return 404 if book does not exist", async () => {
      Book.findById.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/circulation/borrow")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ bookId: validBookId });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Book not found");
    });

    test("should return 400 if no copies are available", async () => {
      Book.findById.mockResolvedValue({
        _id: validBookId,
        title: "Clean Code",
        availableCopies: 0,
      });

      const res = await request(app)
        .post("/api/circulation/borrow")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ bookId: validBookId });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("No copies available");
    });

    test("should successfully borrow an available book", async () => {
      const mockBook = {
        _id: validBookId,
        title: "Clean Code",
        availableCopies: 5,
        save: jest.fn().mockResolvedValue(true),
      };
      Book.findById.mockResolvedValue(mockBook);

      const mockSaveTx = jest.fn().mockResolvedValue(true);
      Transaction.mockImplementation((data) => ({
        ...data,
        _id: validTxId,
        save: mockSaveTx,
      }));

      const res = await request(app)
        .post("/api/circulation/borrow")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ bookId: validBookId, days: 14 });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Book borrowed successfully");
      expect(mockBook.availableCopies).toBe(4);
      expect(mockBook.save).toHaveBeenCalled();
      expect(mockSaveTx).toHaveBeenCalled();
    });
  });

  describe("GET /api/circulation/my-loans", () => {
    test("should reject unauthenticated request with 401", async () => {
      const res = await request(app).get("/api/circulation/my-loans");
      expect(res.statusCode).toBe(401);
    });

    test("should return enriched list of user loans", async () => {
      const mockLoans = [
        {
          _id: validTxId,
          book: validBookId,
          user: "6acbc9c5618a738049a637c3",
          status: "Issued",
          issuedDate: new Date(),
          dueDate: new Date(Date.now() + 14 * 86400000),
        },
      ];

      Transaction.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockLoans),
      });

      Book.find.mockResolvedValue([
        {
          _id: validBookId,
          title: "Clean Code",
          author: "Robert C. Martin",
          category: "Programming",
        },
      ]);

      const res = await request(app)
        .get("/api/circulation/my-loans")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.loans).toHaveLength(1);
      expect(res.body.loans[0].bookTitle).toBe("Clean Code");
      expect(res.body.loans[0].bookAuthor).toBe("Robert C. Martin");
      expect(res.body.loans[0].status).toBe("Issued");
    });
  });

  describe("POST /api/circulation/return/:id", () => {
    test("should reject unauthenticated request with 401", async () => {
      const res = await request(app).post(`/api/circulation/return/${validTxId}`);
      expect(res.statusCode).toBe(401);
    });

    test("should return 404 for non-existent transaction", async () => {
      Transaction.findById.mockResolvedValue(null);

      const res = await request(app)
        .post(`/api/circulation/return/${validTxId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Transaction not found");
    });

    test("should forbid a student from returning another student's loan (403)", async () => {
      Transaction.findById.mockResolvedValue({
        _id: validTxId,
        book: validBookId,
        user: "6acbc9c5618a738049a637c3", // belongs to studentToken
        status: "Issued",
      });

      const res = await request(app)
        .post(`/api/circulation/return/${validTxId}`)
        .set("Authorization", `Bearer ${otherStudentToken}`); // caller is other student

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("You do not have permission to return this book");
    });

    test("should reject returning an already returned book (400)", async () => {
      Transaction.findById.mockResolvedValue({
        _id: validTxId,
        book: validBookId,
        user: "6acbc9c5618a738049a637c3",
        status: "returned",
      });

      const res = await request(app)
        .post(`/api/circulation/return/${validTxId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Book has already been returned");
    });

    test("should allow the loan owner to return their active book", async () => {
      const mockTx = {
        _id: validTxId,
        book: validBookId,
        user: "6acbc9c5618a738049a637c3",
        status: "Issued",
        save: jest.fn().mockResolvedValue(true),
      };
      Transaction.findById.mockResolvedValue(mockTx);

      const mockBook = {
        _id: validBookId,
        availableCopies: 3,
        save: jest.fn().mockResolvedValue(true),
      };
      Book.findById.mockResolvedValue(mockBook);

      const res = await request(app)
        .post(`/api/circulation/return/${validTxId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Book returned successfully");
      expect(mockTx.status).toBe("returned");
      expect(mockBook.availableCopies).toBe(4);
      expect(mockTx.save).toHaveBeenCalled();
      expect(mockBook.save).toHaveBeenCalled();
    });

    test("should allow an admin to return any active loan", async () => {
      const mockTx = {
        _id: validTxId,
        book: validBookId,
        user: "6acbc9c5618a738049a637c3", // borrowed by student
        status: "Issued",
        save: jest.fn().mockResolvedValue(true),
      };
      Transaction.findById.mockResolvedValue(mockTx);

      const mockBook = {
        _id: validBookId,
        availableCopies: 8,
        save: jest.fn().mockResolvedValue(true),
      };
      Book.findById.mockResolvedValue(mockBook);

      const res = await request(app)
        .post(`/api/circulation/return/${validTxId}`)
        .set("Authorization", `Bearer ${adminToken}`); // called by admin

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Book returned successfully");
      expect(mockBook.availableCopies).toBe(9);
    });
  });
});
