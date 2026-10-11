import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Return.css';

function Return() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [returningId, setReturningId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    let isMounted = true;

    async function loadLoans() {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/circulation/my-loans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setLoans(data.loans || []);
          }
        } else {
          const data = await response.json();
          if (isMounted) {
            setIsError(true);
            setMessage(data.message || 'Failed to load loans');
          }
        }
      } catch (err) {
        console.error('Error fetching loans:', err);
        if (isMounted) {
          setIsError(true);
          setMessage('Network error loading loans');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadLoans();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function refreshLoans() {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5001/api/circulation/my-loans', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLoans(data.loans || []);
      }
    } catch (err) {
      console.error('Error refreshing loans:', err);
    }
  }

  async function handleReturnBook(transactionId) {
    setMessage('');
    setIsError(false);
    setReturningId(transactionId);

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

      setIsError(false);
      setMessage(data.message || 'Book returned successfully!');
      refreshLoans();
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    } finally {
      setReturningId(null);
    }
  }

  if (!token) {
    return (
      <div className="circulation-container text-center">
        <h2>My Borrowed Books</h2>
        <p className="circulation-subtitle">
          Please log in to view your borrowed books and return active loans.
        </p>
        <Link to="/login" className="login-prompt-btn">
          Log In Here
        </Link>
      </div>
    );
  }

  return (
    <div className="my-loans-container">
      <h2>My Borrowed Books</h2>
      <p className="my-loans-subtitle">
        Review your active library loans and return books with a single click.
      </p>

      {message && (
        <div className={`circulation-alert ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading your borrowed books...</p>
      ) : loans.length === 0 ? (
        <div className="empty-loans-card">
          <p>You have not borrowed any books yet.</p>
          <Link to="/books" className="browse-books-btn">
            Browse Catalogue to Borrow
          </Link>
        </div>
      ) : (
        <div className="loans-list">
          {loans.map((loan) => {
            const isReturned = loan.status === 'returned';
            const isProcessing = returningId === loan._id;

            return (
              <div key={loan._id} className="loan-card">
                <div className="loan-header">
                  <h3>{loan.bookTitle}</h3>
                  <span className={`status-pill ${isReturned ? 'returned' : 'active'}`}>
                    {isReturned ? 'Returned' : 'Active Loan'}
                  </span>
                </div>

                <p className="loan-author"><strong>Author:</strong> {loan.bookAuthor}</p>
                {loan.category && <p className="loan-category"><strong>Category:</strong> {loan.category}</p>}

                <div className="loan-dates">
                  <p>
                    <strong>Borrowed:</strong>{' '}
                    {loan.issuedDate ? new Date(loan.issuedDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{' '}
                    {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
                  </p>
                  {loan.returndate && (
                    <p>
                      <strong>Returned:</strong>{' '}
                      {new Date(loan.returndate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="loan-actions">
                  {!isReturned ? (
                    <button
                      type="button"
                      onClick={() => handleReturnBook(loan._id)}
                      disabled={isProcessing}
                      className="return-btn"
                    >
                      {isProcessing ? 'Returning...' : 'Return Book'}
                    </button>
                  ) : (
                    <span className="returned-text">Loan closed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Return;
