const express = require('express');
const request = require('supertest');

describe('random routes', () => {
  let app;

  function setup(mockModels) {
    app = express();

    jest.mock('../models', () => mockModels);

    const routes = require('./random');
    routes(app);
  }

  describe('/random-cat route', () => {
    beforeEach(() => {
      setup({
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
      });
    });

    it('should return some details about a random cat', () =>
      request(app)
        .get('/random-cat')
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
