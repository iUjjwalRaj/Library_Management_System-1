import React from 'react';
import './Sec1a.css';

function Card({ books = [] }) {
  if (books.length === 0) {
    return <p>No books available in the catalogue.</p>;
  }

  return (
    <div className="book-list">
      {books.map((book, index) => (
        <div key={book._id || book.isbn || index} className="book-card">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>Category:</strong> {book.category}</p>
          <p><strong>Total Copies:</strong> {book.totalCopies}</p>
          <p><strong>Available Copies:</strong> {book.availableCopies}</p>
        </div>
      ))}
    </div>
  );
}

export default Card;