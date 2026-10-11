import React, { useState, useEffect } from 'react';
import './Sec1Catalouge.css';
import Card from './Sec1a';
import CatalogueFilter from './CatalogueFilter';
import sampleBooks from '../data/sampleBooks';
import { API_URL } from '../config';

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
          ? `${API_URL}/books?${queryString}`
          : `${API_URL}/books`;

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
        ? `${API_URL}/books?${queryString}`
        : `${API_URL}/books`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error searching books:', error);
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

      <Card books={books} />
    </div>
  );
}

export default Sec1Catalouge;