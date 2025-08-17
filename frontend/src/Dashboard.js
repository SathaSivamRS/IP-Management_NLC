import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { auth, db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [ipAddress, setIpAddress] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [usedIPs, setUsedIPs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);

  const ipCollection = collection(db, 'ips');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const loggedUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          username: currentUser.displayName || currentUser.email,
        };
        setUser(loggedUser);
        await fetchUsedIPs(loggedUser.uid);
      } else {
        window.location.href = '/login';
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUsedIPs = async (uid) => {
    try {
      const q = query(ipCollection, where('uid', '==', uid));
      const snapshot = await getDocs(q);
      const ips = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsedIPs(ips);
    } catch (err) {
      console.error('Error fetching used IPs:', err);
    }
  };

  const getUnusedIPs = () => {
    const usedIPAddresses = new Set(usedIPs.map((ip) => ip.ipAddress));
    const unused = [];

    for (let subnet = 92; subnet <= 95; subnet++) {
      for (let host = 1; host <= 254; host++) {
        const ip = `172.16.${subnet}.${host}`;
        if (!usedIPAddresses.has(ip)) {
          unused.push({
            id: ip, // temporary id for frontend
            ipAddress: ip,
            deviceName: '',
            deviceType: '',
          });
        }
      }
    }
    return unused;
  };

  const validateIpAddress = (ip) => {
    const regex = /^172\.16\.(92|93|94|95)\.(1[0-9]|2[0-4][0-9]|[1-9][0-9]?)$/;
    return regex.test(ip);
  };

  const resetForm = () => {
    setIpAddress('');
    setDeviceName('');
    setDeviceType('');
    setEditingId(null);
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
      uid: user.uid,
      createdAt: new Date(),
    };

    try {
      if (editingId) {
        const docRef = doc(db, 'ips', editingId);
        await updateDoc(docRef, newEntry);
      } else {
        // Prevent duplicate IPs
        if (usedIPs.some((ip) => ip.ipAddress === ipAddress)) {
          alert('This IP already exists. Please edit it instead.');
          return;
        }
        await addDoc(ipCollection, newEntry);
      }
      await fetchUsedIPs(user.uid);
      resetForm();
    } catch (err) {
      alert('Error saving IP data: ' + err.message);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setIpAddress(entry.ipAddress);
    setDeviceName(entry.deviceName);
    setDeviceType(entry.deviceType);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this IP?')) return;
    try {
      await deleteDoc(doc(db, 'ips', id));
      await fetchUsedIPs(user.uid);
    } catch (err) {
      alert('Error deleting IP: ' + err.message);
    }
  };

  if (!user) return <div>Loading...</div>;

  // Combine used and unused IPs for display
  const unusedIPs = getUnusedIPs();
  const filteredData =
    filter === 'all'
      ? [...usedIPs, ...unusedIPs]
      : filter === 'used'
      ? usedIPs
      : unusedIPs;

  return (
    <div className="app">
      <header className="navbar">
        <div className="greeting">Hello, {user.username.replace(/_/g, ' ')} 👋</div>
        <button
          className="logout-btn"
          onClick={() => signOut(auth).then(() => (window.location.href = '/login'))}
        >
          Logout
        </button>
      </header>

      <h1 className="title">IP Management System</h1>

      <div className="form">
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

      <div className="filter">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('used')}>Used</button>
        <button onClick={() => setFilter('unused')}>Unused</button>
      </div>

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
            {filteredData.map((entry) => (
              <tr key={entry.id}>
                <td data-label="IP Address">{entry.ipAddress}</td>
                <td data-label="Device Name">{entry.deviceName || '-'}</td>
                <td data-label="Device Type">{entry.deviceType || '-'}</td>
                <td data-label="Actions">
                  {entry.deviceName ? (
                    <>
                      <button className="edit-btn" onClick={() => handleEdit(entry)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(entry.id)}>
                        Delete
                      </button>
                    </>
                  ) : (
                    <span style={{ color: '#888' }}>Unused</span>
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
