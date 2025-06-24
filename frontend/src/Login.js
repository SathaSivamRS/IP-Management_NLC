import React, { useState } from 'react';
import { loginUser } from './api';
import { useNavigate } from 'react-router-dom';
import './index.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const res = await loginUser(form);

    if (res.message === 'Login successful') {
      // ✅ Store full user info (email & username) in localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({ email: res.email, username: res.username })
      );
      navigate('/dashboard');
    } else {
      setMessage(res.message || 'Login failed');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={styles.input}
          value={form.email}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={styles.input}
          value={form.password}
        />
        <button onClick={handleLogin} style={styles.button}>Login</button>

        {message && <p style={styles.message}>{message}</p>}

        <a href="/register" style={styles.link}>
          Don't have an account? <b>Register</b>
        </a>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.85)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '0.5rem',
    color: '#333',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.8rem',
    backgroundColor: '#ff6b6b',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  link: {
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    color: '#444',
    textDecoration: 'none',
  },
  message: {
    color: 'red',
    fontSize: '0.9rem',
  },
};
