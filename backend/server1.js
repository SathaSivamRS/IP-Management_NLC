const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 5001;
const FILE = "./users.json"; // Data file to store user information

app.use(express.json()); // To parse JSON bodies

// Signup endpoint
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  // Read the existing users data from file (ensure it exists)
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(FILE)); // Read users data from JSON file
  } catch (err) {
    console.log("Error reading users data:", err);
    return res.status(500).json({ message: "Error reading user data" });
  }

  // Check if the user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists!" });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    // Save new user
    users.push({ email, password: hashedPassword });

    // Log the data before saving it to file
    console.log("Saving the following data to users.json:", JSON.stringify(users, null, 2));

    // Write back to the file
    try {
      fs.writeFileSync(FILE, JSON.stringify(users, null, 2)); // Write updated data back to the file
      res.status(201).json({ message: "Signup successful" });
    } catch (err) {
      console.log("Error saving user data:", err);
      res.status(500).json({ message: "Error saving user data" });
    }
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(FILE)); // Read users data from JSON file
  } catch (err) {
    return res.status(500).json({ message: "Error reading user data" });
  }

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Compare the password with the hashed password
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) {
      return res.status(500).json({ message: "Error comparing passwords" });
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
