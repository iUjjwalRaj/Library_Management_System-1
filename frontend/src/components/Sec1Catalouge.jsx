import { useState, useEffect } from 'react';
import './Sec1Catalouge.css';
import Card from './Sec1a';
import sampleBooks from '../data/sampleBooks';

function Sec1Catalouge() {
  const [books, setBooks] = useState(sampleBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

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
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        if (isMounted) {
          setBooks(data);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, [category, onlyAvailable]);

  async function handleSearch(e) {
    e.preventDefault();
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
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
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
        <h3>Catalogue</h3>
      </div>

      <form className="filter-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Programming">Programming</option>
          <option value="Science">Science</option>
          <option value="Fiction">Fiction</option>
          <option value="Technology">Technology</option>
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          Available only
        </label>

        <button type="submit" className="search-btn">Search</button>
        <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
      </form>

      <Card books={books} />
    </div>
  );
}

export default Sec1Catalouge;