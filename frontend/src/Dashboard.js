import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const IP_URL = 'https://ip-management-nlc-1.onrender.com';

export default function Dashboard() {
  const [ipAddress, setIpAddress] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [unusedIPs, setUnusedIPs] = useState([]);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user?.username || !user?.email) {
      alert('Invalid session. Please log in again.');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }
    fetchIPs();
    fetchUnusedIPs();
  }, []);

  const fetchIPs = async () => {
    try {
      const res = await axios.get(`${IP_URL}/ips`, {
        params: { username: user.username, email: user.email }
      });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching IPs:', err);
    }
  };

  const fetchUnusedIPs = async () => {
    try {
      const res = await axios.get(`${IP_URL}/unused-ips`);
      setUnusedIPs(res.data);
    } catch (err) {
      console.error('Error fetching unused IPs:', err);
    }
  };

  const validateIpAddress = (ip) => {
    const regex = /^172\.16\.(92|93|94|95)\.(1[0-9]|2[0-4][0-4]|[1-9][0-9]?)$/;
    return regex.test(ip);
  };

  const handleAddOrEdit = async () => {
    if (!ipAddress || !deviceName || !deviceType) {
      alert('All fields are required!');
      return;
    }

    if (!validateIpAddress(ipAddress)) {
      alert('Invalid IP Address! Use 172.16.92-95.x');
      return;
    }

    const payload = {
      ipAddress,
      deviceName,
      deviceType,
      username: user.username,
      email: user.email,
    };

    try {
      if (editingId) {
        await axios.put(`${IP_URL}/ips/${editingId}`, payload);
      } else {
        await axios.post(`${IP_URL}/ips`, payload);
      }
      fetchIPs();
      fetchUnusedIPs();
      resetForm();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Validation failed'));
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setIpAddress(entry.ipAddress);
    setDeviceName(entry.deviceName);
    setDeviceType(entry.deviceType);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this IP?')) {
      try {
        await axios.delete(`${IP_URL}/ips/${id}`);
        fetchIPs();
        fetchUnusedIPs();
      } catch (err) {
        alert('Error deleting IP.');
      }
    }
  };

  const resetForm = () => {
    setIpAddress('');
    setDeviceName('');
    setDeviceType('');
    setEditingId(null);
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="greeting">Hi, {user?.username.replace(/_/g, ' ')} 👋</div>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </header>

      <h1 className="title">IP Management System</h1>

      <div className="form">
        <input
          type="text"
          placeholder="IP Address"
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
          <option value="">Select Type</option>
          <option value="Camera">Camera</option>
          <option value="Laptop">Laptop</option>
          <option value="PC">PC</option>
          <option value="Server">Server</option>
          <option value="Router/Modem">Router/Modem</option>
        </select>
        <button onClick={handleAddOrEdit}>{editingId ? 'Update' : 'Add'}</button>
        <button onClick={resetForm}>Reset</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>IP Address</th>
            <th>Device</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.ipAddress}</td>
              <td>{entry.deviceName}</td>
              <td>{entry.deviceType}</td>
              <td>
                <button onClick={() => handleEdit(entry)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
