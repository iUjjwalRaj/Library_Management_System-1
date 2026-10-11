import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Sec1Catalouge from './components/Sec1Catalouge';
import Borrow from './pages/Borrow';
import Return from './pages/Return';
import Login from './pages/Login';
import AdminBooks from './pages/AdminBooks';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <h1>Library Management System</h1>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Sec1Catalouge />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/return" element={<Return />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminBooks />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;