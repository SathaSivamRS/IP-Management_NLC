// just line
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5001;
const FILE = "data.json";

app.use(bodyParser.json());
app.use(cors());

// Initialize data file if not exists
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

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

app.get("/ips", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

app.get("/unused-ips", (req, res) => {
  const allIPs = generateAllIPs();
  const data = JSON.parse(fs.readFileSync(FILE));
  const usedIPs = data.map((entry) => entry.ipAddress);
  const unusedIPs = allIPs.filter((ip) => !usedIPs.includes(ip));
  res.json(unusedIPs);
});

app.post("/ips", (req, res) => {
  const { ipAddress, deviceName, deviceType } = req.body;

  if (!validateIpAddress(ipAddress)) {
    return res.status(400).json({ message: "Invalid IP Address!" });
  }

  const data = JSON.parse(fs.readFileSync(FILE));
  const exists = data.some((entry) => entry.ipAddress === ipAddress);

  if (exists) {
    return res.status(400).json({ message: "IP Address already exists!" });
  }

  data.push({ id: Date.now(), ipAddress, deviceName, deviceType });
  fs.writeFileSync(FILE, JSON.stringify(data));
  res.status(201).send("IP added successfully.");
});

app.put("/ips/:id", (req, res) => {
  const { id } = req.params;
  const { ipAddress, deviceName, deviceType } = req.body;

  const data = JSON.parse(fs.readFileSync(FILE));
  const index = data.findIndex((entry) => entry.id == id);

  if (index === -1) {
    return res.status(404).send("IP not found!");
  }

  data[index] = { id, ipAddress, deviceName, deviceType };
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
