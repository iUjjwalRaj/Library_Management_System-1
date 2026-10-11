import React, { useState } from 'react';
import './BookForm.css';

function BookForm({ editingBook, onSave, onCancel }) {
  const [title, setTitle] = useState(editingBook ? editingBook.title : '');
  const [author, setAuthor] = useState(editingBook ? editingBook.author : '');
  const [isbn, setIsbn] = useState(editingBook ? editingBook.isbn : '');
  const [category, setCategory] = useState(editingBook ? editingBook.category : '');
  const [totalCopies, setTotalCopies] = useState(
    editingBook && editingBook.totalCopies !== undefined ? String(editingBook.totalCopies) : ''
  );
  const [availableCopies, setAvailableCopies] = useState(
    editingBook && editingBook.availableCopies !== undefined ? String(editingBook.availableCopies) : ''
  );

  function handleSubmit(e) {
    e.preventDefault();

    const bookData = {
      title,
      author,
      isbn,
      category,
      totalCopies: parseInt(totalCopies, 10),
      availableCopies: parseInt(availableCopies, 10),
    };

    onSave(bookData);
  }

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h3>{editingBook ? 'Edit Book Record' : 'Add New Book'}</h3>

      <label>Title</label>
      <input
        type="text"
        placeholder="Book Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Author</label>
      <input
        type="text"
        placeholder="Author Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />

      <label>ISBN</label>
      <input
        type="text"
        placeholder="Unique ISBN"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        required
      />

      <label>Category</label>
      <input
        type="text"
        placeholder="e.g. Software Engineering"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />

      <div className="form-row">
        <div>
          <label>Total Copies</label>
          <input
            type="number"
            min="0"
            value={totalCopies}
            onChange={(e) => setTotalCopies(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Available Copies</label>
          <input
            type="number"
            min="0"
            value={availableCopies}
            onChange={(e) => setAvailableCopies(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="btn-group">
        <button type="submit" className="form-btn save-btn">
          {editingBook ? 'Update Book' : 'Add Book'}
        </button>
        {editingBook && (
          <button type="button" onClick={onCancel} className="form-btn cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default BookForm;
