import React from 'react';
import './TransactionCard.css';

function TransactionCard({ title = 'Transaction Details', transaction }) {
  if (!transaction) {
    return null;
  }

  return (
    <div className="transaction-card">
      <h3>{title}</h3>
      <p><strong>Transaction ID:</strong> {transaction._id}</p>
      <p><strong>Book ID:</strong> {transaction.book}</p>
      {transaction.user && <p><strong>User ID:</strong> {transaction.user}</p>}
      {transaction.dueDate && (
        <p><strong>Due Date:</strong> {new Date(transaction.dueDate).toLocaleDateString()}</p>
      )}
      {transaction.returndate && (
        <p><strong>Return Date:</strong> {new Date(transaction.returndate).toLocaleString()}</p>
      )}
      <p><strong>Status:</strong> {transaction.status}</p>
    </div>
  );
}

export default TransactionCard;
