/* eslint-disable import/no-dynamic-require, global-require */

const glob = require('glob');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../../config');

const db = {};

const { name, hostname, username, password } = config.database;

const sequelize = new Sequelize(name, username, password, {
  host: hostname,
  dialect: 'mysql',
});

const MODELS_PATH = path.join(__dirname, '.');
glob(`${MODELS_PATH}/**/*.js`, (err, files) => {
  files
    .filter(file => !file.endsWith('/index.js'))
    .filter(file => !file.endsWith('.test.js'))
    .forEach(file => {
      const model = sequelize.import(file);
      db[model.name] = model;
    });
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
