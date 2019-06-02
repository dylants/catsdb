/* eslint-disable import/no-dynamic-require, global-require */

const bodyParser = require('body-parser');
const express = require('express');
const glob = require('glob');
const path = require('path');

const config = require('../config');
const logger = require('./lib/logger');
const { verifyToken } = require('./lib/auth');

/* ------------------------------------------ *
 * Initialize server
 * ------------------------------------------ */
// output the config for debugging
logger.info('config', { config });

const app = express();

/* ------------------------------------------ *
 * Middleware
 * ------------------------------------------ */
app.use(bodyParser.json());

/* ------------------------------------------ *
 * APIs
 * ------------------------------------------ */
const ROUTES_PATH = path.join(__dirname, 'routes');

// process the unsecure routes
const unsecureApiRouter = new express.Router();
glob(`${ROUTES_PATH}/unsecure/**/*.js`, (err, files) => {
  files
    .filter(file => !file.endsWith('.test.js'))
    .forEach(file => require(file)(unsecureApiRouter));
});
app.use('/', unsecureApiRouter);

// add the security check
app.all('/secure/*', (req, res, next) => {
  const token = req.get('authToken');
  if (token && verifyToken(token)) {
    return next();
  }

  return res.status(401).send({
    error: 'Unauthorized',
  });
});

// process the secure routes
const secureApiRouter = new express.Router();
glob(`${ROUTES_PATH}/secure/**/*.js`, (err, files) => {
  files
    .filter(file => !file.endsWith('.test.js'))
    .forEach(file => require(file)(secureApiRouter));
});
app.use('/secure', secureApiRouter);

// send a 404 for any unmatched API route
app.use('/*', (req, res) => res.status(404).end());

/* ------------------------------------------ *
 * Start Express
 * ------------------------------------------ */
app.listen(config.port, err => {
  if (err) {
    return logger.error(err);
  }

  return logger.info(`Running on port ${config.port}!`);
});
