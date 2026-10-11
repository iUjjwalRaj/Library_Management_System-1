import React, { useState } from 'react';
import './Login.css';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  async function handleLogin({ email, password }) {
    setMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);

      const userRes = await fetch('http://localhost:5001/api/auth/', {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (userRes.ok) {
        const uData = await userRes.json();
        setCurrentUser(uData.user);
        localStorage.setItem('user', JSON.stringify(uData.user));
      }
      setMessage('Login successful!');
      setIsError(false);
    } catch (err) {
      setMessage(err.message || 'Login failed');
      setIsError(true);
    }
  }

  async function handleRegister(userData) {
    setMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage('Registration successful! Please log in.');
      setIsError(false);
      setIsRegister(false);
    } catch (err) {
      setMessage(err.message || 'Registration failed');
      setIsError(true);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setMessage('Logged out successfully.');
    setIsError(false);
  }

  if (currentUser) {
    return (
      <div className="auth-card">
        <h2>Welcome, {currentUser.name}!</h2>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Role:</strong> {currentUser.role}</p>
        <button onClick={handleLogout} className="btn-logout">Log Out</button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2>{isRegister ? 'Register Account' : 'Student & Admin Login'}</h2>

      {message && (
        <div className={`alert-box ${isError ? 'error' : 'success'}`}>{message}</div>
      )}

      {isRegister ? (
        <RegisterForm onRegister={handleRegister} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}

      <p className="auth-toggle">
        {isRegister ? 'Already registered?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage('');
          }}
          className="btn-toggle"
        >
          {isRegister ? 'Log In here' : 'Register here'}
        </button>
      </p>
    </div>
  );
}

export default Login;
