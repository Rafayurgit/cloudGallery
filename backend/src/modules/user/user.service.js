const User = require("./user.model");

const createUser = async ({ name, tenantId, email, password }) => {
  return User.create({ name, tenantId, email, password });
};

const getUserByEmail = async ({ tenantId, email }) => {
  return User.findOne({ tenantId, email: email.toLowerCase() });
};

const getUserById = async (id) => {
  return User.findById(id).select("-password");
};

module.exports = { createUser, getUserByEmail, getUserById };
