import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand-logo">
        <img src="/lotus.svg" alt="Lotus logo" className="logo-img" />
        <span className="brand-title">LibraryMS</span>
      </Link>
      <ul className="nav-menu">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/books" className="nav-link">Catalogue</Link></li>
        <li><Link to="/borrow" className="nav-link">Borrow</Link></li>
        <li><Link to="/return" className="nav-link">My Books</Link></li>
        <li><Link to="/login" className="nav-link">Login</Link></li>
        <li><Link to="/admin" className="nav-link admin-badge">Admin</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;