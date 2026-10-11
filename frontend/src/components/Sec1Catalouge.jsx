import { useState, useEffect } from 'react';
import './Sec1Catalouge.css';
import Card from './Sec1a';
import sampleBooks from '../data/sampleBooks';

function Sec1Catalouge() {
  const [books, setBooks] = useState(sampleBooks);

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch('http://localhost:5001/api/books');

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    getData();
  }, []);

  return (
    <div className="catalogue">
      <h3>Catalogue</h3>
      <Card books={books} />
    </div>
  );
}

export default Sec1Catalouge;