const validator = require("validator");

const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    return "Invalid email format";
  }
  return null;
};

const validatePassword = (password) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
};

module.exports = {
  validateEmail,
  validatePassword,
};
