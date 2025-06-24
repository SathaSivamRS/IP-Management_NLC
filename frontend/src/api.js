// Auth server (login/register)
const AUTH_API = 'https://ip-management-nlc.onrender.com';

// IP management server (ips/unused-ips)
const IP_API = 'https://ip-management-nlc-1.onrender.com';

export const registerUser = async (user) => {
  const res = await fetch(`${AUTH_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const loginUser = async (user) => {
  const res = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
};

// Optional: Export IP_API if you want to use it in Dashboard.js
export { IP_API };
