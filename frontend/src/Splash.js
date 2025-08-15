// Splash.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // Redirect to login after 2.5s
    }, 2500);

    return () => clearTimeout(timer); // cleanup on unmount
  }, [navigate]);

  return (
    <div style={styles.container}>
      {/* Optional: replace this with your logo */}
      {/* <img
        src="/logo.png" // place your logo in public folder
        alt="App Logo"
        style={styles.logo}
      /> */}
      <div style={styles.spinner}></div>
      <h1 style={styles.text}>Loading...</h1>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#111",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  spinner: {
    width: 50,
    height: 50,
    border: "6px solid rgba(255,255,255,0.3)",
    borderTop: "6px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: 20,
  },
  text: {
    fontSize: 22,
  },
};

// Add keyframes for spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }`,
  styleSheet.cssRules.length
);

export default Splash;
