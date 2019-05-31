const express = require('express');
const request = require('supertest');

describe('cats routes', () => {
  let app;

  beforeEach(() => {
    app = express();

    jest.mock('../models', () => ({
      Cat: {
        findAll: () =>
          Promise.resolve([
            {
              breed: 'Yellow',
              foo: 'bar',
              imageUrl: 'http://foo.com',
              name: 'Meow',
            },
          ]),
      },
    }));

    const routes = require('./cats');
    routes(app);
  });

  describe('/cats/random route', () => {
    it('should return some details about a random cat', () =>
      request(app)
        .get('/cats/random')
        .expect(200)
        .then(data => {
          expect(data.body).toEqual({
            breed: 'Yellow',
            imageUrl: 'http://foo.com',
            name: 'Meow',
          });
        }));
  });
});
