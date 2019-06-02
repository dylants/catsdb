const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');

describe('login routes', () => {
  let app;

  function setup(mockModels, mockValidatePassword, mockGenerateToken) {
    app = express();
    app.use(bodyParser.json());

    jest.resetModules();
    jest.restoreAllMocks();
    jest.mock('../../models', () => mockModels);
    jest.mock('../../lib/auth', () => ({
      generateToken: mockGenerateToken,
      validatePassword: mockValidatePassword,
    }));

    const routes = require('./login');
    routes(app);
  }

  describe('/login route', () => {
    const VALID_INPUT = {
      username: 'foo',
      password: 'bar',
    };

    describe('validation checks', () => {
      beforeEach(() => {
        setup();
      });

      it.each`
        test                    | body                   | error
        ${'without a username'} | ${{}}                  | ${'username is required'}
        ${'without a password'} | ${{ username: 'foo' }} | ${'password is required'}
      `('should return 400 $test', ({ body, error }) =>
        request(app)
          .post('/login')
          .send(body)
          .expect(400)
          .then(data => {
            expect(data.body).toEqual({
              error,
            });
          }),
      );
    });

    describe('when password validation succeeds', () => {
      beforeEach(() => {
        setup(
          {
            User: {
              findOne: () =>
                Promise.resolve({
                  password: 'foo',
                  update: () => {},
                }),
            },
          },
          () => true,
          () => 'abc',
        );
      });

      it('should return 201 with valid data', () =>
        request(app)
          .post('/login')
          .send(VALID_INPUT)
          .expect(201)
          .then(data => {
            expect(data.body).toEqual({
              authToken: 'abc',
            });
          }));
    });

    describe('when user can not be found', () => {
      beforeEach(() => {
        setup(
          {
            User: {
              findOne: () => Promise.resolve(null),
            },
          },
          () => true,
        );
      });

      it('should return 401', () =>
        request(app)
          .post('/login')
          .send(VALID_INPUT)
          .expect(401)
          .then(data => {
            expect(data.body).toEqual({
              error: 'username or password is invalid',
            });
          }));
    });

    describe('when password validation fails', () => {
      beforeEach(() => {
        setup(
          {
            User: {
              findOne: () =>
                Promise.resolve({
                  password: 'foo',
                }),
            },
          },
          () => false,
        );
      });

      it('should return 401', () =>
        request(app)
          .post('/login')
          .send(VALID_INPUT)
          .expect(401)
          .then(data => {
            expect(data.body).toEqual({
              error: 'username or password is invalid',
            });
          }));
    });

    describe('when things go boom', () => {
      beforeEach(() => {
        setup(
          {
            User: {
              findOne: () => Promise.reject(),
            },
          },
          () => false,
        );
      });

      it('should return 500', () =>
        request(app)
          .post('/login')
          .send(VALID_INPUT)
          .expect(500)
          .then(data => {
            expect(data.body).toEqual({
              error: 'Server error',
            });
          }));
    });
  });
});
