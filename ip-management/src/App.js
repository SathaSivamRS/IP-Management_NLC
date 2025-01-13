import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [unusedIPs, setUnusedIPs] = useState([]);

  useEffect(() => {
    fetchIPs();
    fetchUnusedIPs();
  }, []);

  const fetchIPs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ips");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUnusedIPs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/unused-ips");
      setUnusedIPs(response.data);
    } catch (error) {
      console.error("Error fetching unused IPs:", error);
    }
  };

  const validateIpAddress = (ip) => {
    const regex = /^172\.16\.(92|93|94|95)\.(1[0-9]|2[0-4][0-4]|[1-9][0-9]?)$/;
    return regex.test(ip);
  };

  const handleAddOrEdit = async () => {
    if (!ipAddress || !deviceName || !deviceType) {
      alert("All fields are required!");
      return;
    }

    if (!validateIpAddress(ipAddress)) {
      alert("Invalid IP Address! Please enter a valid IP witclshin the range 172.16.92.x to 172.16.95.x.");
      return;
    }

    const newEntry = { ipAddress, deviceName, deviceType };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/ips/${editingId}`, newEntry);
      } else {
        await axios.post("http://localhost:5000/ips", newEntry);
      }
      fetchIPs();
      fetchUnusedIPs();
      resetForm();
    } catch (error) {
      alert("Error: " + error.response?.data?.message || "Validation Failed!");
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setIpAddress(entry.ipAddress);
    setDeviceName(entry.deviceName);
    setDeviceType(entry.deviceType);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this IP?")) {
      try {
        await axios.delete(`http://localhost:5000/ips/${id}`);
        fetchIPs();
        fetchUnusedIPs();
      } catch (error) {
        alert("Error deleting IP.");
      }
    }
  };

  const resetForm = () => {
    setIpAddress("");
    setDeviceName("");
    setDeviceType("");
    setEditingId(null);
  };

  const filteredData =
    filter === "all"
      ? data
      : filter === "used"
      ? data.filter((d) => d.deviceName)
      : unusedIPs.map((ip) => ({ ipAddress: ip, deviceName: "", deviceType: "" }));

  return (
    <div className="app">
      <h1 className="title">IP Management System</h1>
      <div className="form">
        <input
          type="text"
          placeholder="IP Address (e.g., 172.16.92.1)"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Device Name"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />
        <select
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
        >
          <option value="">Select Device Type</option>
          <option value="Camera">Camera</option>
          <option value="Laptop">Laptop</option>
          <option value="PC">PC</option>
          <option value="Server">Server</option>
          <option value="Router/Modem">Router/Modem</option>
          <option value="Switches">Switches</option>
          <option value="PlayStation">PlayStation</option>
        </select>
        <button onClick={handleAddOrEdit}>
          {editingId ? "Update" : "Add"}
        </button>
        <button onClick={resetForm}>Reset</button>
      </div>
      <div className="filter">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("used")}>Used</button>
        <button onClick={() => setFilter("unused")}>Unused</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>IP Address</th>
            <th>Device Name</th>
            <th>Device Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.ipAddress}</td>
              <td>{entry.deviceName}</td>
              <td>{entry.deviceType}</td>
              <td>
                {entry.deviceName ? (
                  <>
                    <button onClick={() => handleEdit(entry)}>Edit</button>
                    <button onClick={() => handleDelete(entry.id)}>Delete</button>
                  </>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
