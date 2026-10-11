import React from 'react';
import { Link } from 'react-router-dom';
import './Borrow.css';
import Sec1Catalouge from '../components/Sec1Catalouge';

function Borrow() {
  return (
    <div className="student-borrow-page">
      <div className="borrow-hero">
        <h2>Borrow Books</h2>
        <p className="borrow-subtitle">
          Browse available titles below and click <strong>Borrow</strong> on any book to issue it for 14 days.
        </p>
        <div className="borrow-info-box">
          <span>Already borrowed books?</span>{' '}
          <Link to="/return" className="borrow-loans-link">
            View My Borrowed Books & Return
          </Link>
        </div>
      </div>

      <Sec1Catalouge />
    </div>
  );
}

export default Borrow;
