import React from 'react';
import './BookList.css';
import BookItem from './BookItem';

function BookList({ books = [], onEdit, onDelete }) {
  if (books.length === 0) {
    return <p className="empty-books-text">No books currently in the database.</p>;
  }

  return (
    <div className="book-list-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Copies (Avail/Total)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <BookItem
              key={book._id || book.isbn}
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
