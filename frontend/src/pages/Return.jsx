import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Return.css';

function Return() {
  const [loans, setLoans] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [reload, setReload] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    async function fetchLoans() {
      try {
        const res = await fetch('http://localhost:5001/api/circulation/my-loans', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setLoans(data.loans || []);
        } else {
          setMessage(data.message || 'Failed to load loans');
          setIsError(true);
        }
      } catch (err) {
        console.error('Error loading loans:', err);
        setMessage('Network error loading loans');
        setIsError(true);
      }
    }

    fetchLoans();
  }, [token, reload]);

  async function handleReturn(loanId) {
    setMessage('');
    try {
      const res = await fetch(`http://localhost:5001/api/circulation/return/${loanId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage('Book returned successfully!');
      setIsError(false);
      setReload((r) => r + 1);
    } catch (err) {
      setMessage(err.message || 'Failed to return book');
      setIsError(true);
    }
  }

  if (!token) {
    return (
      <div className="return-page auth-notice">
        <h2>My Borrowed Books</h2>
        <p>Please log in to view your borrowed books and return active loans.</p>
        <Link to="/login" className="btn-primary">Log In</Link>
      </div>
    );
  }

  return (
    <div className="return-page">
      <h2>My Borrowed Books</h2>
      <p className="subtitle">View your loans and return books when you are finished.</p>

      {message && (
        <div className={`alert-box ${isError ? 'error' : 'success'}`}>{message}</div>
      )}

      {loans.length === 0 ? (
        <div className="empty-box">
          <p>You have no borrowed books right now.</p>
          <Link to="/books" className="btn-primary">Browse Catalogue</Link>
        </div>
      ) : (
        <div className="loans-grid">
          {loans.map((loan) => (
            <div key={loan._id} className="loan-card">
              <h3>{loan.bookTitle}</h3>
              <p><strong>Author:</strong> {loan.bookAuthor}</p>
              <p><strong>Due Date:</strong> {new Date(loan.dueDate).toLocaleDateString()}</p>
              <div className="loan-footer">
                <span className={`status-badge ${loan.status.toLowerCase()}`}>
                  {loan.status === 'Issued' ? 'Active Loan' : 'Returned'}
                </span>
                {loan.status === 'Issued' && (
                  <button onClick={() => handleReturn(loan._id)} className="btn-return">
                    Return Book
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Return;
