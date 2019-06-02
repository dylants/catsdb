const bcrypt = require('bcrypt');

// increase this to increase security, but take a hit on performance
const SALT_ROUNDS = 1;

exports.hashPassword = async password => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

exports.validatePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
