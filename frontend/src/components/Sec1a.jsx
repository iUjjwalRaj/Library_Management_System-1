import './Sec1a.css';

// Shows one book with its cover image and Borrow button
function BookCard({ book, onBorrow }) {
  const isAvailable = book.availableCopies > 0;
  // Use book's coverImage, or generate Open Library URL from ISBN, or use local fallback
  const coverUrl =
    book.coverImage ||
    (book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg` : '/default-cover.svg');

  return (
    <div className="book-card">
      <div className="book-cover-container">
        <img
          src={coverUrl}
          alt={`Cover of ${book.title}`}
          className="book-cover-img"
          loading="lazy"
          onError={(e) => {
            // Prevent infinite loop if fallback image triggers an error
            if (!e.currentTarget.src.endsWith('/default-cover.svg')) {
              e.currentTarget.src = '/default-cover.svg';
            }
          }}
        />
      </div>

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