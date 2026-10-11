import React, { useState } from 'react';
import './Return.css';
import TransactionCard from '../components/TransactionCard';

function Return() {
  const [transactionId, setTransactionId] = useState('');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('token') || '');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [returnedRecord, setReturnedRecord] = useState(null);

  async function handleReturnBook(e) {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setReturnedRecord(null);

    const token = adminToken || localStorage.getItem('token');
    if (!token) {
      setIsError(true);
      setMessage('Admin authorization token is required to process returns.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/circulation/return/${transactionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to return book');
      }

      setMessage(data.message || 'Book returned successfully!');
      setReturnedRecord(data.transaction);
      setTransactionId('');
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  return (
    <div className="circulation-container">
      <h2>Return Book</h2>
      <p className="circulation-subtitle">
        Process a book return and restore inventory count using the Transaction ID.
      </p>

      {message && (
        <div className={`circulation-alert ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <TransactionCard
        title="Return Completed"
        transaction={returnedRecord}
      />

      <form onSubmit={handleReturnBook} className="circulation-form">
        <label>Transaction ID</label>
        <input
          type="text"
          placeholder="Enter the transaction ID to return"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          required
        />

        <label>Admin Token</label>
        <input
          type="text"
          placeholder="Paste admin JWT token if not logged in as admin"
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
        />

        <button type="submit" className="circulation-btn return-btn">Process Return</button>
      </form>
    </div>
  );
}

export default Return;
