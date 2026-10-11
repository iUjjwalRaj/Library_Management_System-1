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
  const [borrowMessage, setBorrowMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [borrowingBookId, setBorrowingBookId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      try {
        const queryParams = new URLSearchParams();
        if (category) {
          queryParams.append('category', category);
        }
        if (onlyAvailable) {
          queryParams.append('available', 'true');
        }

        const queryString = queryParams.toString();
        const url = queryString
          ? `http://localhost:5001/api/books?${queryString}`
          : 'http://localhost:5001/api/books';

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setBooks(data);
          }
        }
      } catch (error) {
        console.error('Error loading books:', error);
      }
    }

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, [category, onlyAvailable]);

  async function refreshBooksList() {
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      if (category) {
        queryParams.append('category', category);
      }
      if (onlyAvailable) {
        queryParams.append('available', 'true');
      }

      const queryString = queryParams.toString();
      const url = queryString
        ? `http://localhost:5001/api/books?${queryString}`
        : 'http://localhost:5001/api/books';

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error refreshing books:', error);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    refreshBooksList();
  }

  function handleReset() {
    setSearchTerm('');
    setCategory('');
    setOnlyAvailable(false);
  }

  async function handleBorrow(book) {
    setBorrowMessage('');
    setIsError(false);

    const token = localStorage.getItem('token');
    if (!token) {
      setIsError(true);
      setBorrowMessage('You must be logged in to borrow books. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
      return;
    }

    setBorrowingBookId(book._id);

    try {
      const response = await fetch('http://localhost:5001/api/circulation/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to borrow book');
      }

      setIsError(false);
      setBorrowMessage(`"${book.title}" borrowed successfully! View your loan in the Return page.`);
      refreshBooksList();
    } catch (err) {
      setIsError(true);
      setBorrowMessage(err.message);
    } finally {
      setBorrowingBookId(null);
    }
  }

  return (
    <div className="catalogue">
      <div className="catalogue-header">
        <h3>Catalogue</h3>
      </div>

      {borrowMessage && (
        <div className={`catalogue-alert ${isError ? 'error' : 'success'}`}>
          {borrowMessage}
        </div>
      )}

      <CatalogueFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        onlyAvailable={onlyAvailable}
        onAvailableChange={setOnlyAvailable}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <Card
        books={books}
        onBorrow={handleBorrow}
        borrowingBookId={borrowingBookId}
      />
    </div>
  );
}

export default Sec1Catalouge;