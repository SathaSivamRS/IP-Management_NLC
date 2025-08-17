import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from './firebase'; // make sure db is Firestore instance
import { doc, setDoc } from 'firebase/firestore';
import './index.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const tempDomains = [
    'mailinator.com',
    'guerrillamail.com',
    'tempmail.com',
    '10minutemail.com',
    'emailondeck.com',
    'dispostable.com',
    'cybtric.com',
  ];
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      if (/^[a-zA-Z0-9_]*$/.test(value)) setForm({ ...form, [name]: value });
    } else setForm({ ...form, [name]: value });

    if (name === 'password') checkPasswordStrength(value);
  };

  const checkPasswordStrength = (p) => {
    if (p.length < 6) setPasswordStrength('Weak ❌');
    else if (p.length < 10) setPasswordStrength('Medium ⚠️');
    else setPasswordStrength('Strong ✅');
  };

  const handleRegister = async () => {
    const { fullName, username, email, password, confirmPassword } = form;
    const domain = email.split('@').pop();

    if (!fullName || !username || !email || !password || !confirmPassword) {
      setMessage('❌ Please fill in all fields.');
      return;
    }
    if (!usernameRegex.test(username)) {
      setMessage('❌ Username can only contain letters, numbers, and underscores.');
      return;
    }
    if (tempDomains.includes(domain)) {
      setMessage('❌ Temporary email domains are not allowed.');
      return;
    }
    if (!passwordRegex.test(password)) {
      setMessage('❌ Password must have 8+ chars, uppercase, lowercase, number, and symbol.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('❌ Password and Confirm Password must match.');
      return;
    }

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update user profile
      await updateProfile(firebaseUser, { displayName: fullName });

      // Save user details in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        fullName,
        username,
        email,
        uid: firebaseUser.uid,
        createdAt: new Date()
      });

      console.log('User created and saved in Firestore:', firebaseUser.uid);
      setMessage('✅ Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Firebase registration error:', error);
      setMessage(`❌ ${error.code}: ${error.message}`);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="username"
          placeholder="Username (letters, numbers, _ only)"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />
        {passwordStrength && <p style={styles.strength}>Password Strength: {passwordStrength}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          style={styles.input}
        />

        <button onClick={handleRegister} style={styles.button}>
          Register
        </button>

        {message && <p style={styles.message}>{message}</p>}

        <a href="/login" style={styles.link}>
          Already have an account? <b>Login</b>
        </a>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to right, #fbc2eb, #a6c1ee)' },
  card: { background: 'rgba(255, 255, 255, 0.85)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', width: '90%', maxWidth: '450px', textAlign: 'center' },
  title: { marginBottom: '0.5rem', color: '#333' },
  input: { padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' },
  button: { padding: '0.8rem', backgroundColor: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
  link: { marginTop: '0.5rem', fontSize: '0.9rem', color: '#444', textDecoration: 'none' },
  message: { color: 'red', fontSize: '0.9rem' },
  strength: { fontSize: '0.9rem', color: '#444' }
};
