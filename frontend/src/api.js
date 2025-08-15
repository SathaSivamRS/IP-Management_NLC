// Use environment variables if available, else fallback to defaults
const AUTH_API = process.env.REACT_APP_AUTH_API || 'https://ip-management-nlc.onrender.com';
const IP_API = process.env.REACT_APP_IP_API || 'https://ip-management-nlc-1.onrender.com';

/**
 * Register a new user
 * @param {Object} user - { username, email, password }
 * @returns {Promise<Object>} - API response
 */
export const registerUser = async (user) => {
  try {
    const res = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (error) {
    console.error('Register API error:', error);
    return { status: 'error', message: 'Failed to register. Please try again.' };
  }
};

/**
 * Login a user
 * @param {Object} user - { email, password }
 * @returns {Promise<Object>} - API response
 */
export const loginUser = async (user) => {
  try {
    const res = await fetch(`${AUTH_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (error) {
    console.error('Login API error:', error);
    return { status: 'error', message: 'Failed to login. Please try again.' };
  }
};

// Export IP_API if you want to use it elsewhere
export { IP_API };
