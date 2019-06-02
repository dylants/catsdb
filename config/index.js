const PORT = process.env.PORT || 3000;

const isDevelopment = process.env.NODE_ENV === 'development';

const LOG_LEVEL = isDevelopment ? 'debug' : 'verbose';

module.exports = {
  auth: {
    saltRounds: 1,
    secretKey: 'secret',
  },
  logLevel: LOG_LEVEL, // [error, warn, info, verbose, debug, silly]
  port: PORT,
};
