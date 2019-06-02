const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../../../config');

const SALT_ROUNDS = config.auth.saltRounds;
const KEY = config.auth.secretKey;

exports.hashPassword = async password => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

exports.validatePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

exports.generateToken = username => {
  return jwt.sign({ username }, KEY);
};

exports.verifyToken = token => {
  try {
    jwt.verify(token, KEY);
  } catch (err) {
    return false;
  }

  return true;
};
