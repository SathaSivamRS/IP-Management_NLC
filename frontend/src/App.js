import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './Dashboard';
import Splash from './Splash'; // 👈 add splash

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Splash />} /> {/* 👈 Splash as landing page */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
