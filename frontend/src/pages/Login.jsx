import React, { useState, useEffect } from 'react';
import './Login.css';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('other');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    async function fetchCurrentUser() {
      try {
        const response = await fetch('http://localhost:5001/api/auth/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    }

    fetchCurrentUser();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      if (isRegister) {
        const response = await fetch('http://localhost:5001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, gender, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        setMessage('Registration successful! Please log in.');
        setIsRegister(false);
        setPassword('');
      } else {
        const response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('token', data.token);
        setMessage('Login successful!');

        const userRes = await fetch('http://localhost:5001/api/auth/', {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData.user);
        }
      }
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setMessage('Logged out successfully.');
    setIsError(false);
  }

  if (currentUser) {
    return (
      <div className="auth-container">
        <h2>Welcome, {currentUser.name}!</h2>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Role:</strong> {currentUser.role}</p>
        <button onClick={handleLogout} className="auth-btn logout-btn">Log Out</button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>{isRegister ? 'Register an Account' : 'Log In'}</h2>

      {message && (
        <div className={`auth-alert ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {isRegister && (
          <>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </>
        )}

        <label>Email</label>
        <input
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-btn">
          {isRegister ? 'Register' : 'Log In'}
        </button>
      </form>

      <p className="auth-toggle">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage('');
          }}
          className="toggle-btn"
        >
          {isRegister ? 'Log In here' : 'Register here'}
        </button>
      </p>
    </div>
  );
}

export default Login;
