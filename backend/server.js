const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));

app.use(cors());
app.use(express.json());

const filePath = './users.json';
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));

const isTempEmail = email => {
  const tempDomains = ['tempmail.com', '10minutemail.com', 'mailinator.com'];
  return tempDomains.some(domain => email.endsWith(`@${domain}`));
};

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (isTempEmail(email)) {
    return res.status(400).json({ message: 'Temporary email not allowed' });
  }

  if (password.length < 6 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return res.status(400).json({ message: 'Password must be 6+ chars, include uppercase & number' });
  }

  let users = JSON.parse(fs.readFileSync(filePath));
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, email, password: hashedPassword });
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  res.json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(filePath));
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid email or password' });

  res.json({ message: 'Login successful', username: user.username });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
