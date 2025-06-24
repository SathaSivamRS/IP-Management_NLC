const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`IP server running on port ${PORT}`));
const FILE = "data.json";

app.use(bodyParser.json());
app.use(cors());

// Initialize data file if not exists
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

// IP address validation
const validateIpAddress = (ip) => {
  const regex = /^172\.16\.(92|93|94|95)\.(1[0-9]|2[0-4][0-4]|[1-9][0-9]?)$/;
  return regex.test(ip);
};

// Generate all possible IPs in the range
const generateAllIPs = () => {
  const ips = [];
  for (let i = 92; i <= 95; i++) {
    for (let j = 1; j <= 244; j++) {
      ips.push(`172.16.${i}.${j}`);
    }
  }
  return ips;
};

// Fetch all IPs (filtered by username if provided)
app.get("/ips", (req, res) => {
  const { username } = req.query;
  const data = JSON.parse(fs.readFileSync(FILE));

  if (username) {
    const filteredData = data.filter((entry) => entry.username === username);
    return res.json(filteredData);
  }

  res.json(data); // fallback: return all IPs
});

// Fetch all unused IPs (common for all users)
app.get("/unused-ips", (req, res) => {
  const allIPs = generateAllIPs();
  const data = JSON.parse(fs.readFileSync(FILE));
  const usedIPs = data.map((entry) => entry.ipAddress);
  const unusedIPs = allIPs.filter((ip) => !usedIPs.includes(ip));
  res.json(unusedIPs);
});

// Add new IP
app.post("/ips", (req, res) => {
  const { ipAddress, deviceName, deviceType, username } = req.body;

  if (!validateIpAddress(ipAddress)) {
    return res.status(400).json({ message: "Invalid IP Address!" });
  }

  const data = JSON.parse(fs.readFileSync(FILE));
  const exists = data.some((entry) => entry.ipAddress === ipAddress);

  if (exists) {
    return res.status(400).json({ message: "IP Address already exists!" });
  }

  data.push({ id: Date.now(), ipAddress, deviceName, deviceType, username });
  fs.writeFileSync(FILE, JSON.stringify(data));
  res.status(201).send("IP added successfully.");
});

// Edit existing IP by ID
app.put("/ips/:id", (req, res) => {
  const { id } = req.params;
  const { ipAddress, deviceName, deviceType } = req.body;

  const data = JSON.parse(fs.readFileSync(FILE));
  const index = data.findIndex((entry) => entry.id == id);

  if (index === -1) {
    return res.status(404).send("IP not found!");
  }

  // Preserve username
  data[index] = { ...data[index], ipAddress, deviceName, deviceType };
  fs.writeFileSync(FILE, JSON.stringify(data));
  res.send("IP updated successfully.");
});

// Delete IP by ID
app.delete("/ips/:id", (req, res) => {
  const { id } = req.params;

  const data = JSON.parse(fs.readFileSync(FILE));
  const newData = data.filter((entry) => entry.id != id);

  fs.writeFileSync(FILE, JSON.stringify(newData));
  res.send("IP deleted successfully.");
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
