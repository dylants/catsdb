/* eslint-disable import/no-dynamic-require, global-require */

const bodyParser = require('body-parser');
const express = require('express');
const glob = require('glob');
const path = require('path');

const config = require('../config');
const logger = require('./lib/logger');

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
const apiRouter = new express.Router();

const ROUTES_PATH = path.join(__dirname, 'routes');
glob(`${ROUTES_PATH}/**/*.js`, (err, files) => {
  files
    .filter(file => !file.endsWith('.test.js'))
    .forEach(file => require(file)(apiRouter));
});
app.use('/', apiRouter);

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
