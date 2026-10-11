import React, { useState, useEffect } from 'react';
import './AdminBooks.css';

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [totalCopies, setTotalCopies] = useState('');
  const [availableCopies, setAvailableCopies] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      try {
        const response = await fetch('http://localhost:5001/api/books');
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setBooks(data);
          }
        }
      } catch (err) {
        console.error('Error loading books:', err);
      }
    }

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  async function refreshBooks() {
    try {
      const response = await fetch('http://localhost:5001/api/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (err) {
      console.error('Error refreshing books:', err);
    }
  }

  function handleEditClick(book) {
    setEditingId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setCategory(book.category);
    setTotalCopies(book.totalCopies);
    setAvailableCopies(book.availableCopies);
    setMessage('');
    setIsError(false);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setIsbn('');
    setCategory('');
    setTotalCopies('');
    setAvailableCopies('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const total = parseInt(totalCopies, 10);
    const available = parseInt(availableCopies, 10);

    if (total < 0 || available < 0) {
      setIsError(true);
      setMessage('Copy counts cannot be negative.');
      return;
    }

    if (available > total) {
      setIsError(true);
      setMessage('Available copies cannot exceed total copies.');
      return;
    }

    const payload = {
      title,
      author,
      isbn,
      category,
      totalCopies: total,
      availableCopies: available,
    };

    try {
      if (editingId) {
        const response = await fetch(`http://localhost:5001/api/books/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update book');
        }

        setMessage('Book updated successfully!');
        handleCancelEdit();
      } else {
        const response = await fetch('http://localhost:5001/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create book');
        }

        setMessage('Book created successfully!');
        handleCancelEdit();
      }

      refreshBooks();
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  async function handleDelete(bookId) {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete book');
      }

      setMessage('Book deleted successfully.');
      setIsError(false);
      refreshBooks();
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  return (
    <div className="admin-container">
      <h2>Admin Book Management</h2>
      <p className="admin-subtitle">Create, update, and remove catalogue book records.</p>

      {message && (
        <div className={`admin-alert ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="admin-form-card">
        <h3>{editingId ? 'Edit Book Record' : 'Add New Book'}</h3>
        <form onSubmit={handleSubmit} className="admin-form">
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
            <button type="submit" className="admin-btn save-btn">
              {editingId ? 'Update Book' : 'Add Book'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="admin-btn cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-table-card">
        <h3>Existing Books ({books.length})</h3>
        {books.length === 0 ? (
          <p>No books currently in database.</p>
        ) : (
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
              {books.map((b) => (
                <tr key={b._id}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.isbn}</td>
                  <td>{b.category}</td>
                  <td>{b.availableCopies} / {b.totalCopies}</td>
                  <td>
                    <button onClick={() => handleEditClick(b)} className="action-btn edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(b._id)} className="action-btn delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminBooks;
