// seedBooks.js - Idempotent seed script to populate sample books
// Run via: npm run seed (or node seedBooks.js from the backend directory)

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Book = require("./models/bookModel");

const sampleBooks = [
  // 1. Programming and Software Engineering
  {
    title: "The Pragmatic Programmer: Your Journey to Mastery",
    author: "David Thomas, Andrew Hunt",
    isbn: "9780201616224",
    category: "Software Engineering",
    totalCopies: 8,
    availableCopies: 7,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780201616224-M.jpg"
  },
  {
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    isbn: "9780201633610",
    category: "Software Engineering",
    totalCopies: 6,
    availableCopies: 5,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780201633610-M.jpg"
  },
  {
    title: "Refactoring: Improving the Design of Existing Code",
    author: "Martin Fowler",
    isbn: "9780201485677",
    category: "Software Engineering",
    totalCopies: 7,
    availableCopies: 6,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780201485677-M.jpg"
  },
  {
    title: "Code Complete: A Practical Handbook of Software Construction",
    author: "Steve McConnell",
    isbn: "9780735619678",
    category: "Software Engineering",
    totalCopies: 5,
    availableCopies: 4,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780735619678-M.jpg"
  },
  {
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    isbn: "9780596517748",
    category: "Programming",
    totalCopies: 9,
    availableCopies: 8,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780596517748-M.jpg"
  },
  {
    title: "Fluent Python: Clear, Concise, and Effective Programming",
    author: "Luciano Ramalho",
    isbn: "9781491946008",
    category: "Programming",
    totalCopies: 7,
    availableCopies: 6,
    coverImage: "https://covers.openlibrary.org/b/isbn/9781491946008-M.jpg"
  },

  // 2. Data Structures and Algorithms
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    isbn: "9780262033848",
    category: "Data Structures & Algorithms",
    totalCopies: 8,
    availableCopies: 6,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg"
  },
  {
    title: "Grokking Algorithms: An Illustrated Guide",
    author: "Aditya Bhargava",
    isbn: "9781617292231",
    category: "Data Structures & Algorithms",
    totalCopies: 10,
    availableCopies: 9,
    coverImage: "https://covers.openlibrary.org/b/isbn/9781617292231-M.jpg"
  },
  {
    title: "Algorithms",
    author: "Robert Sedgewick, Kevin Wayne",
    isbn: "9780321573513",
    category: "Data Structures & Algorithms",
    totalCopies: 6,
    availableCopies: 5,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780321573513-M.jpg"
  },

  // 3. Artificial Intelligence and Machine Learning
  {
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    isbn: "9780136042594",
    category: "Artificial Intelligence",
    totalCopies: 7,
    availableCopies: 6,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780136042594-M.jpg"
  },
  {
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    isbn: "9780262035613",
    category: "Artificial Intelligence",
    totalCopies: 6,
    availableCopies: 5,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780262035613-M.jpg"
  },
  {
    title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
    author: "Aurélien Géron",
    isbn: "9781492032649",
    category: "Machine Learning",
    totalCopies: 8,
    availableCopies: 7,
    coverImage: "https://covers.openlibrary.org/b/isbn/9781492032649-M.jpg"
  },
  {
    title: "Pattern Recognition and Machine Learning",
    author: "Christopher M. Bishop",
    isbn: "9780387310732",
    category: "Machine Learning",
    totalCopies: 5,
    availableCopies: 4,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780387310732-M.jpg"
  },

  // 4. Computer Science
  {
    title: "Structure and Interpretation of Computer Programs",
    author: "Harold Abelson, Gerald Jay Sussman",
    isbn: "9780262510875",
    category: "Computer Science",
    totalCopies: 6,
    availableCopies: 5,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780262510875-M.jpg"
  },
  {
    title: "Operating System Concepts",
    author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
    isbn: "9781118063330",
    category: "Computer Science",
    totalCopies: 8,
    availableCopies: 7,
    coverImage: "https://covers.openlibrary.org/b/isbn/9781118063330-M.jpg"
  },
  {
    title: "Computer Systems: A Programmer's Perspective",
    author: "Randal E. Bryant, David R. O'Hallaron",
    isbn: "9780134092669",
    category: "Computer Science",
    totalCopies: 7,
    availableCopies: 6,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780134092669-M.jpg"
  },
  {
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum, David J. Wetherall",
    isbn: "9780132126953",
    category: "Computer Science",
    totalCopies: 6,
    availableCopies: 5,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780132126953-M.jpg"
  },

  // 5. Mathematics
  {
    title: "Discrete Mathematics and Its Applications",
    author: "Kenneth H. Rosen",
    isbn: "9780073383095",
    category: "Mathematics",
    totalCopies: 9,
    availableCopies: 8,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780073383095-M.jpg"
  },
  {
    title: "Linear Algebra and Its Applications",
    author: "Gilbert Strang",
    isbn: "9780030105678",
    category: "Mathematics",
    totalCopies: 7,
    availableCopies: 6,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780030105678-M.jpg"
  },
  {
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    isbn: "9781285740621",
    category: "Mathematics",
    totalCopies: 6,
    availableCopies: 5,
    coverImage: "https://covers.openlibrary.org/b/isbn/9781285740621-M.jpg"
  },

  // 6. Science
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "9780553380163",
    category: "Science",
    totalCopies: 10,
    availableCopies: 9,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780553380163-M.jpg"
  },
  {
    title: "Cosmos",
    author: "Carl Sagan",
    isbn: "9780345331359",
    category: "Science",
    totalCopies: 8,
    availableCopies: 7,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780345331359-M.jpg"
  },
  {
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    isbn: "9780199291151",
    category: "Science",
    totalCopies: 7,
    availableCopies: 6,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780199291151-M.jpg"
  },

  // 7. Fiction and Literature
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    category: "Fiction & Literature",
    totalCopies: 10,
    availableCopies: 8,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    category: "Fiction & Literature",
    totalCopies: 12,
    availableCopies: 10,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg"
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    category: "Fiction & Literature",
    totalCopies: 9,
    availableCopies: 8,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg"
  },

  // 8. Personal Development
  {
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
    author: "James Clear",
    isbn: "9780735211292",
    category: "Personal Development",
    totalCopies: 12,
    availableCopies: 11,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg"
  },
  {
    title: "Deep Work: Rules for Focused Success in a Distracted World",
    author: "Cal Newport",
    isbn: "9781455586691",
    category: "Personal Development",
    totalCopies: 8,
    availableCopies: 7,
    coverImage: "https://covers.openlibrary.org/b/isbn/9781455586691-M.jpg"
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "9780374533557",
    category: "Personal Development",
    totalCopies: 10,
    availableCopies: 9,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780374533557-M.jpg"
  }
];

async function seedDatabase() {
  try {
    await connectDB();

    // If existing Clean Code doesn't have coverImage set, update it gracefully
    const cleanCode = await Book.findOne({ isbn: "9780132350884" });
    if (cleanCode && !cleanCode.coverImage) {
      cleanCode.coverImage = "https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg";
      await cleanCode.save();
      console.log("Updated existing 'Clean Code' with coverImage.");
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const bookData of sampleBooks) {
      // Check if book with this ISBN already exists
      const existing = await Book.findOne({ isbn: bookData.isbn });
      if (existing) {
        skippedCount++;
      } else {
        await Book.create(bookData);
        insertedCount++;
      }
    }

    const totalBooks = await Book.countDocuments();
    console.log("-----------------------------------------");
    console.log(`Seeding complete!`);
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Skipped (already exist): ${skippedCount}`);
    console.log(`Total books in collection: ${totalBooks}`);
    console.log("-----------------------------------------");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
}

seedDatabase();
