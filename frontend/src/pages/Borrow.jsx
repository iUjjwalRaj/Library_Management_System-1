import React, { useState } from 'react';
import './Borrow.css';

function Borrow() {
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('token') || '');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [issuedTransaction, setIssuedTransaction] = useState(null);

  async function handleIssueBook(e) {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIssuedTransaction(null);

    const token = adminToken || localStorage.getItem('token');
    if (!token) {
      setIsError(true);
      setMessage('Admin authorization token is required to issue books.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/circulation/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId, userId, dueDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to issue book');
      }

      setMessage(data.message || 'Book issued successfully!');
      setIssuedTransaction(data.transaction);
      setBookId('');
      setUserId('');
      setDueDate('');
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  return (
    <div className="circulation-container">
      <h2>Issue Book (Borrow)</h2>
      <p className="circulation-subtitle">
        Assign a book to a user record. Requires administrative privileges.
      </p>

      {message && (
        <div className={`circulation-alert ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {issuedTransaction && (
        <div className="transaction-card">
          <h3>Transaction Created</h3>
          <p><strong>Transaction ID:</strong> {issuedTransaction._id}</p>
          <p><strong>Book ID:</strong> {issuedTransaction.book}</p>
          <p><strong>User ID:</strong> {issuedTransaction.user}</p>
          <p><strong>Due Date:</strong> {new Date(issuedTransaction.dueDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {issuedTransaction.status}</p>
        </div>
      )}

      <form onSubmit={handleIssueBook} className="circulation-form">
        <label>Book ID (MongoDB Object ID)</label>
        <input
          type="text"
          placeholder="e.g. 6acbb82a618a738049a637c2"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        />

        <label>User ID</label>
        <input
          type="text"
          placeholder="e.g. 6acbc9c5618a738049a637c3"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <label>Admin Token</label>
        <input
          type="text"
          placeholder="Paste admin JWT token if not logged in as admin"
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
        />

        <button type="submit" className="circulation-btn">Issue Book</button>
      </form>
    </div>
  );
}

export default Borrow;
