import React from 'react';
import './BookItem.css';

function BookItem({ book, onEdit, onDelete }) {
  return (
    <tr className="book-item-row">
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td>{book.isbn}</td>
      <td>{book.category}</td>
      <td>{book.availableCopies} / {book.totalCopies}</td>
      <td>
        <button onClick={() => onEdit(book)} className="action-btn edit-btn">
          Edit
        </button>
        <button onClick={() => onDelete(book._id)} className="action-btn delete-btn">
          Delete
        </button>
      </td>
    </tr>
  );
}

export default BookItem;
