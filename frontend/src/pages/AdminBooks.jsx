import React, { useState, useEffect } from 'react';
import './AdminBooks.css';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function loadBooks() {
    try {
      const res = await fetch('http://localhost:5001/api/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch {
      setMessage('Failed to load books');
      setIsError(true);
    }
  }

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('http://localhost:5001/api/books');
        if (res.ok && active) {
          const data = await res.json();
          setBooks(data);
        }
      } catch {
        if (active) {
          setMessage('Failed to load books');
          setIsError(true);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  async function handleSaveBook(bookData) {
    setMessage('');
    try {
      const url = editingBook
        ? `http://localhost:5001/api/books/${editingBook._id}`
        : 'http://localhost:5001/api/books';
      const method = editingBook ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage(editingBook ? 'Book updated successfully!' : 'Book added successfully!');
      setIsError(false);
      setEditingBook(null);
      loadBooks();
    } catch (err) {
      setMessage(err.message || 'Operation failed');
      setIsError(true);
    }
  }

  async function handleDeleteBook(id) {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete book');
      setMessage('Book deleted successfully');
      setIsError(false);
      loadBooks();
    } catch (err) {
      setMessage(err.message || 'Error deleting book');
      setIsError(true);
    }
  }

  return (
    <div className="admin-page">
      <h2>Admin Book Management</h2>
      <p className="subtitle">Add, edit, or remove books from the library catalogue.</p>

      {message && (
        <div className={`alert-box ${isError ? 'error' : 'success'}`}>{message}</div>
      )}

      <div className="admin-form-card">
        <BookForm
          key={editingBook ? editingBook._id : 'new-book'}
          editingBook={editingBook}
          onSave={handleSaveBook}
          onCancel={() => setEditingBook(null)}
        />
      </div>

      <div className="admin-table-card">
        <h3>Existing Books ({books.length})</h3>
        <BookList
          books={books}
          onEdit={setEditingBook}
          onDelete={handleDeleteBook}
        />
      </div>
    </div>
  );
}

export default AdminBooks;
