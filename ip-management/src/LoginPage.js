import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      alert(response.data.message);
      // Redirect user to dashboard or other page after successful login
    } catch (error) {
      alert("Error: " + error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="form-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <br />
          <Link to="/signup">Don't have an account? Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
