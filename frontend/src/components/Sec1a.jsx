import React from 'react';
import './Sec1a.css';

function Card({ books = [], onBorrow, borrowingBookId }) {
  if (books.length === 0) {
    return <p className="empty-message">No books available in the catalogue.</p>;
  }

  return (
    <div className="book-list">
      {books.map((book, index) => {
        const isAvailable = book.availableCopies > 0;
        const isBorrowing = borrowingBookId === book._id;

        return (
          <div key={book._id || book.isbn || index} className="book-card">
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Category:</strong> {book.category}</p>
            <p>
              <strong>Available:</strong>{' '}
              <span className={isAvailable ? 'copies-available' : 'copies-zero'}>
                {book.availableCopies} / {book.totalCopies}
              </span>
            </p>

            <div className="card-actions">
              {onBorrow && (
                <button
                  type="button"
                  onClick={() => onBorrow(book)}
                  disabled={!isAvailable || isBorrowing}
                  className={`borrow-btn ${!isAvailable ? 'unavailable-btn' : ''}`}
                >
                  {!isAvailable
                    ? 'Currently unavailable'
                    : isBorrowing
                    ? 'Borrowing...'
                    : 'Borrow'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Card;