import React, { useState } from "react";
import axios from "axios";
import validator from "validator";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!validator.isEmail(email)) {
      alert("Invalid email format");
      return;
    }

    try {
      await axios.post("http://localhost:5000/forgot-password", { email });
      alert("A password reset link has been sent to your email.");
    } catch (error) {
      alert("Error: " + error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
