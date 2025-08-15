import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { IP_API } from './api';

export default function Dashboard() {
  const [ipAddress, setIpAddress] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all');
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
      const response = await axios.get(
        `${IP_API}/ips?username=${user.username}&email=${user.email}`
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching IPs:', error);
    }
  };

  const fetchUnusedIPs = async () => {
    try {
      const response = await axios.get(
        `${IP_API}/unused-ips?username=${user.username}&email=${user.email}`
      );
      setUnusedIPs(response.data);
    } catch (error) {
      console.error('Error fetching unused IPs:', error);
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
      alert('Invalid IP Address! Use range 172.16.92.x to 172.16.95.x.');
      return;
    }

    const newEntry = {
      ipAddress,
      deviceName,
      deviceType,
      username: user.username,
      email: user.email,
    };

    try {
      if (editingId) {
        await axios.put(`${IP_API}/ips/${editingId}`, newEntry);
      } else {
        await axios.post(`${IP_API}/ips`, newEntry);
      }
      fetchIPs();
      fetchUnusedIPs();
      resetForm();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Validation failed'));
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
        await axios.delete(`${IP_API}/ips/${id}`);
        fetchIPs();
        fetchUnusedIPs();
      } catch (error) {
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

  const filteredData =
    filter === 'all'
      ? data
      : filter === 'used'
      ? data.filter((d) => d.deviceName)
      : unusedIPs.map((ip) => ({
          ipAddress: ip.ipAddress || ip,
          deviceName: '',
          deviceType: '',
        }));

  return (
    <div className="app">
      <header className="navbar">
        <div className="greeting">Hello, {user?.username.replace(/_/g, ' ')} 👋</div>
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

      {/* ===== Form ===== */}
      <div className="form">
        {/* Row 1: IP Address + Device Name */}
        <div className="form-row">
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
        </div>

        {/* Row 2: Device Type + Buttons */}
        <div className="form-row">
          <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
            <option value="">Select Device Type</option>
            <option value="Camera">Camera</option>
            <option value="Laptop">Laptop</option>
            <option value="PC">PC</option>
            <option value="Server">Server</option>
            <option value="Router/Modem">Router/Modem</option>
            <option value="Switches">Switches</option>
            <option value="PlayStation">PlayStation</option>
          </select>

          <div className="form-buttons">
            <button onClick={handleAddOrEdit}>{editingId ? 'Update' : 'Add'}</button>
            <button onClick={resetForm}>Reset</button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('used')}>Used</button>
        <button onClick={() => setFilter('unused')}>Unused</button>
      </div>

      {/* Table */}
      <div className="table-container">
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
                <td data-label="IP Address">{entry.ipAddress}</td>
                <td data-label="Device Name">{entry.deviceName || '-'}</td>
                <td data-label="Device Type">{entry.deviceType || '-'}</td>
                <td data-label="Actions">
                  {entry.deviceName ? (
                    <>
                      <button className="edit-btn" onClick={() => handleEdit(entry)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(entry.id)}>Delete</button>
                    </>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
