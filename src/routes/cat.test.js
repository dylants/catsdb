const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');
const { UniqueConstraintError } = require('sequelize');

describe('cat routes', () => {
  let app;

  function setup(mockModels) {
    app = express();
    app.use(bodyParser.json());

    jest.resetModules();
    jest.restoreAllMocks();
    jest.mock('../models', () => mockModels);

    const routes = require('./cat');
    routes(app);
  }

  describe('/cat/register route, when create succeeds', () => {
    const VALID_INPUT = {
      name: 'foo',
      username: 'foo',
      password: 'barbarbar',
      weight: 2.4,
    };

    beforeEach(() => {
      setup({
        Cat: {
          create: () => Promise.resolve(),
        },
      });
    });

    it('should return 400 without name', () =>
      request(app)
        .post('/cat/register')
        .send({})
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({ error: 'name is required' });
        }));

    it('should return 400 without username', () =>
      request(app)
        .post('/cat/register')
        .send({ name: 'foo' })
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({ error: 'username is required' });
        }));

    it('should return 400 without password', () =>
      request(app)
        .post('/cat/register')
        .send({ name: 'foo', username: 'foo' })
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({ error: 'password is required' });
        }));

    it('should return 400 without weight', () =>
      request(app)
        .post('/cat/register')
        .send({ name: 'foo', username: 'foo', password: 'bar' })
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({ error: 'weight is required' });
        }));

    it('should return 400 with invalid password', () =>
      request(app)
        .post('/cat/register')
        .send({ name: 'foo', username: 'foo', password: 'bar', weight: 2.4 })
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({
            error: 'password must be 8 characters or more',
          });
        }));

    it('should return 204 with valid data', () =>
      request(app)
        .post('/cat/register')
        .send(VALID_INPUT)
        .expect(204));
  });

  describe('/cat/register route, when create fails with SequelizeUniqueConstraintError', () => {
    const VALID_INPUT = {
      name: 'foo',
      username: 'foo',
      password: 'barbarbar',
      weight: 2.4,
    };

    beforeEach(() => {
      setup({
        Cat: {
          create: () => Promise.reject(new UniqueConstraintError()),
        },
      });
    });

    it('should return 400', () =>
      request(app)
        .post('/cat/register')
        .send(VALID_INPUT)
        .expect(400)
        .then(data => {
          expect(data.body).toEqual({
            error: 'username must be unique',
          });
        }));
  });

  describe('/cat/register route, when create fails', () => {
    const VALID_INPUT = {
      name: 'foo',
      username: 'foo',
      password: 'barbarbar',
      weight: 2.4,
    };

    beforeEach(() => {
      setup({
        Cat: {
          create: () => Promise.reject(),
        },
      });
    });

    it('should return 500', () =>
      request(app)
        .post('/cat/register')
        .send(VALID_INPUT)
        .expect(500)
        .then(data => {
          expect(data.body).toEqual({
            error: 'Server error',
          });
        }));
  });
});
