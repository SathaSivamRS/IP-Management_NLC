const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;
const FILE = "data.json";

app.use(bodyParser.json());
app.use(cors());

if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([]));

const validateIpAddress = (ip) => {
  const regex = /^172\.16\.(92|93|94|95)\.(1[0-9]|2[0-4][0-4]|[1-9][0-9]?)$/;
  return regex.test(ip);
};

const generateAllIPs = () => {
  const ips = [];
  for (let i = 92; i <= 95; i++) {
    for (let j = 1; j <= 244; j++) {
      ips.push(`172.16.${i}.${j}`);
    }
  }
  return ips;
};

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});


app.get("/ips", (req, res) => {
  const { username, email } = req.query;
  const data = JSON.parse(fs.readFileSync(FILE));
  if (username && email) {
    const filtered = data.filter((entry) => entry.username === username && entry.email === email);
    return res.json(filtered);
  }
  res.json([]);
});

app.get("/unused-ips", (req, res) => {
  const { username, email } = req.query;

  if (!username || !email) {
    return res.status(400).json({ message: "Missing username or email" });
  }

  const allIPs = generateAllIPs();
  const data = JSON.parse(fs.readFileSync(FILE));

  const userUsedIPs = data
    .filter((entry) => entry.username === username && entry.email === email)
    .map((entry) => entry.ipAddress);

  const unusedIPs = allIPs.filter((ip) => !userUsedIPs.includes(ip));
  res.json(unusedIPs);
});


app.post("/ips", (req, res) => {
  const { ipAddress, deviceName, deviceType, username, email } = req.body;

  if (!validateIpAddress(ipAddress)) {
    return res.status(400).json({ message: "Invalid IP Address!" });
  }

  const data = JSON.parse(fs.readFileSync(FILE));

  // Only block if this user has already used this IP
  const existsForUser = data.some(
    (entry) =>
      entry.ipAddress === ipAddress &&
      entry.username === username &&
      entry.email === email
  );

  if (existsForUser) {
    return res.status(400).json({ message: "You have already used this IP!" });
  }

  data.push({ id: Date.now(), ipAddress, deviceName, deviceType, username, email });
  fs.writeFileSync(FILE, JSON.stringify(data));
  res.status(201).send("IP added successfully.");
});


app.put("/ips/:id", (req, res) => {
  const { id } = req.params;
  const { ipAddress, deviceName, deviceType } = req.body;
  const data = JSON.parse(fs.readFileSync(FILE));
  const index = data.findIndex((entry) => entry.id == id);
  if (index === -1) return res.status(404).send("IP not found!");

  data[index] = { ...data[index], ipAddress, deviceName, deviceType };
  fs.writeFileSync(FILE, JSON.stringify(data));
  res.send("IP updated successfully.");
});

app.delete("/ips/:id", (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(FILE));
  const newData = data.filter((entry) => entry.id != id);
  fs.writeFileSync(FILE, JSON.stringify(newData));
  res.send("IP deleted successfully.");
});

app.listen(PORT, () => console.log(`IP server running on port ${PORT}`));
