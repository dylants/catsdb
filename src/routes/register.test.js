const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');
const { UniqueConstraintError } = require('sequelize');

describe('register routes', () => {
  const VALID_INPUT = {
    username: 'foo',
    password: 'barbarbar',
  };

  let app;

  function setup(mockModels) {
    app = express();
    app.use(bodyParser.json());

    jest.resetModules();
    jest.restoreAllMocks();
    jest.mock('../models', () => mockModels);

    const routes = require('./register');
    routes(app);
  }

  describe('/register route, when create succeeds', () => {
    beforeEach(() => {
      setup({
        User: {
          create: () => Promise.resolve(),
        },
      });
    });

    it('should return 400 without username', () =>
      request(app)
        .post('/register')
        .send({})
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({ error: 'username is required' });
        }));

    it('should return 400 without password', () =>
      request(app)
        .post('/register')
        .send({ username: 'foo' })
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({ error: 'password is required' });
        }));

    it('should return 400 with invalid password', () =>
      request(app)
        .post('/register')
        .send({ username: 'foo', password: 'bar' })
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({
            error: 'password must be 8 characters or more',
          });
        }));

    it('should return 204 with valid data', () =>
      request(app)
        .post('/register')
        .send(VALID_INPUT)
        .expect(204));
  });

  describe('/register route, when create fails with SequelizeUniqueConstraintError', () => {
    beforeEach(() => {
      setup({
        User: {
          create: () => Promise.reject(new UniqueConstraintError()),
        },
      });
    });

    it('should return 400', () =>
      request(app)
        .post('/register')
        .send(VALID_INPUT)
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({
            error: 'username must be unique',
          });
        }));
  });

  describe('/register route, when create fails', () => {
    beforeEach(() => {
      setup({
        User: {
          create: () => Promise.reject(),
        },
      });
    });

    it('should return 500', () =>
      request(app)
        .post('/register')
        .send(VALID_INPUT)
        .expect(500)
        .then(data => {
          expect(data.body).toEqual({
            error: 'Server error',
          });
        }));
  });
});
