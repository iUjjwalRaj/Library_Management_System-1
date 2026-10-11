import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sec1Catalouge.css';
import Card from './Sec1a';
import CatalogueFilter from './CatalogueFilter';
import sampleBooks from '../data/sampleBooks';

function Sec1Catalouge() {
  const [books, setBooks] = useState(sampleBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const query = new URLSearchParams();
        if (category) query.append('category', category);
        if (onlyAvailable) query.append('available', 'true');
        const res = await fetch(`http://localhost:5001/api/books?${query}`);
        if (res.ok && active) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (err) {
        console.error('Error fetching catalogue:', err);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [category, onlyAvailable]);

  async function refreshBooks() {
    try {
      const query = new URLSearchParams();
      if (searchTerm) query.append('search', searchTerm);
      if (category) query.append('category', category);
      if (onlyAvailable) query.append('available', 'true');
      const res = await fetch(`http://localhost:5001/api/books?${query}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error('Error refreshing catalogue:', err);
    }
  }

  async function handleBorrow(book) {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to borrow books.');
      setIsError(true);
      setTimeout(() => navigate('/login'), 1200);
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/circulation/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage(`"${book.title}" borrowed successfully! View it in My Loans.`);
      setIsError(false);
      refreshBooks();
    } catch (err) {
      setMessage(err.message || 'Failed to borrow book');
      setIsError(true);
    }
  }

  function handleReset() {
    setSearchTerm('');
    setCategory('');
    setOnlyAvailable(false);
  }

  return (
    <div className="catalogue">
      <div className="catalogue-header">
        <h3>Book Catalogue</h3>
      </div>

      {message && (
        <div className={`alert-box ${isError ? 'error' : 'success'}`}>{message}</div>
      )}

      <CatalogueFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        onlyAvailable={onlyAvailable}
        onAvailableChange={setOnlyAvailable}
        onSearch={(e) => {
          e.preventDefault();
          refreshBooks();
        }}
        onReset={handleReset}
      />

      <Card books={books} onBorrow={handleBorrow} />
    </div>
  );
}

export default Sec1Catalouge;