import React from 'react';
import './Sec1a.css';

function Card({ books = [], onBorrow }) {
  if (books.length === 0) {
    return <p className="empty-message">No books match your search.</p>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => {
        const isAvailable = book.availableCopies > 0;

        return (
          <div key={book._id || book.isbn} className="book-card">
            <span className="book-category">{book.category || 'General'}</span>
            <h4 className="book-title">{book.title}</h4>
            <p className="book-author">by {book.author}</p>
            <div className="book-meta">
              <span className="copies-label">Available:</span>
              <span className={`copies-count ${isAvailable ? 'in-stock' : 'out-of-stock'}`}>
                {book.availableCopies} of {book.totalCopies}
              </span>
            </div>
            {onBorrow && (
              <button
                type="button"
                onClick={() => onBorrow(book)}
                disabled={!isAvailable}
                className={`btn-borrow ${!isAvailable ? 'disabled' : ''}`}
              >
                {isAvailable ? 'Borrow' : 'Currently unavailable'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Card;