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

    it.each`
      test                          | body                                    | error
      ${'without a username'}       | ${{}}                                   | ${'username is required'}
      ${'without a password'}       | ${{ username: 'foo' }}                  | ${'password is required'}
      ${'with an invalid password'} | ${{ username: 'foo', password: 'bar' }} | ${'password must be 8 characters or more'}
    `('should return 400 $test', ({ body, error }) =>
      request(app)
        .post('/register')
        .send(body)
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({
            error,
          });
        }),
    );

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
