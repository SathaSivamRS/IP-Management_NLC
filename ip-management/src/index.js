import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';  // Correct import of LoginPage
import Signup from './Signup'; 
import ForgotPassword from './ForgotPassword'; 
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Set the default route to the Login page */}
        <Route path="/" element={<LoginPage />} /> {/* Use LoginPage */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<LoginPage />} /> {/* Ensure LoginPage */}
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
