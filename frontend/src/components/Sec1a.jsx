import './Sec1a.css';

// Shows one book and its Borrow button
function BookCard({ book, onBorrow }) {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="book-card">
      <span className="book-category">{book.category}</span>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">by {book.author}</p>

      <div className="book-meta">
        <span className="copies-label">Available copies</span>
        <span className={`copies-count ${isAvailable ? 'in-stock' : 'out-of-stock'}`}>
          {book.availableCopies} / {book.totalCopies}
        </span>
      </div>

      <button className="btn-borrow" onClick={() => onBorrow(book)} disabled={!isAvailable}>
        {isAvailable ? 'Borrow' : 'Currently unavailable'}
      </button>
    </div>
  );
}

export default BookCard;