import React, { useState, useEffect } from 'react';
import './AdminBooks.css';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
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
        console.error('Error fetching books:', err);
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

  async function handleSaveBook(bookData) {
    setMessage('');
    setIsError(false);

    if (bookData.totalCopies < 0 || bookData.availableCopies < 0) {
      setIsError(true);
      setMessage('Copy counts cannot be negative.');
      return;
    }

    if (bookData.availableCopies > bookData.totalCopies) {
      setIsError(true);
      setMessage('Available copies cannot exceed total copies.');
      return;
    }

    try {
      const url = editingBook
        ? `http://localhost:5001/api/books/${editingBook._id}`
        : 'http://localhost:5001/api/books';
      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      setMessage(editingBook ? 'Book updated successfully!' : 'Book created successfully!');
      setEditingBook(null);
      refreshBooks();
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  async function handleDeleteBook(bookId) {
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

      <div className="admin-card">
        <BookForm
          key={editingBook ? editingBook._id : 'new-book'}
          editingBook={editingBook}
          onSave={handleSaveBook}
          onCancel={() => setEditingBook(null)}
        />
      </div>

      <div className="admin-card">
        <h3>Existing Books ({books.length})</h3>
        <BookList
          books={books}
          onEdit={(book) => setEditingBook(book)}
          onDelete={handleDeleteBook}
        />
      </div>
    </div>
  );
}

export default AdminBooks;
