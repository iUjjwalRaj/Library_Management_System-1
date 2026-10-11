import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src="/lotus.svg" alt="Lotus logo" className="logo" />
      </Link>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/borrow">Borrow</Link></li>
        <li><Link to="/return">Return</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;