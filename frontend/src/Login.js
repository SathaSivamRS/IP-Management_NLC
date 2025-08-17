import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase"; // Import your Firebase config
import "./index.css"; // Your custom basic CSS (for body/background)

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(app);

  // For handling input value changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // For handling the form login action
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear error before action
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;
      // console.log("Firebase user:", user);

      // Save minimal user info to localStorage
      const userObj = { email: user.email, uid: user.uid };
      localStorage.setItem("user", JSON.stringify(userObj));

      // Navigate on success
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
          {message && <p style={styles.message}>{message}</p>}
        </form>
        <a href="/register" style={styles.link}>
          Don't have an account? <b>Register</b>
        </a>
      </div>
    </div>
  );
}

// Inline styles for component
const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at 20% 20%, #fbd6d1 40%, #e7e6fa 100%)", // gradient background
    padding: "1rem",
    overflow: "hidden",
  },
  card: {
  background: "rgba(255, 255, 255, 0.9)",
  padding: "2rem 2.5rem",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  width: "100%",
  maxWidth: "340px",  // Tighter on desktop
  minWidth: "280px",
  textAlign: "center",
  boxSizing: "border-box",
  overflowY: "auto",
  // overflowX: "hidden" is okay if needed
},
  card: {
  background: "rgba(255, 255, 255, 0.9)",
  padding: "2rem 2.5rem",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  width: "100%",
  maxWidth: "340px",  // Tighter on desktop
  minWidth: "280px",
  textAlign: "center",
  boxSizing: "border-box",
  overflowY: "auto",
  // overflowX: "hidden" is okay if needed
},
title: {
  marginBottom: "0.5rem",
  color: "#1a1a1a",
  fontSize: "1.7rem",
  fontWeight: 600,
  letterSpacing: "1px",
},
input: {
  width: "100%",
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
},
button: {
  width: "100%",
  padding: "0.8rem",
  fontSize: "1.1rem",
  backgroundColor: "#ff6b6b",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background 0.3s",
},
  link: {
    marginTop: "0.5rem",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    color: "#444",
    textDecoration: "none",
  },
  message: {
    color: "red",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
  },
};
