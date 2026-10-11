import React, { useState } from 'react';
import './Return.css';

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

      {returnedRecord && (
        <div className="transaction-card">
          <h3>Return Completed</h3>
          <p><strong>Transaction ID:</strong> {returnedRecord._id}</p>
          <p><strong>Book ID:</strong> {returnedRecord.book}</p>
          <p><strong>Return Date:</strong> {new Date(returnedRecord.returndate).toLocaleString()}</p>
          <p><strong>Status:</strong> {returnedRecord.status}</p>
        </div>
      )}

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
