const express = require('express');
const request = require('supertest');

describe('cats routes', () => {
  let app;

  beforeEach(() => {
    app = express();

    const routes = require('./cats');
    routes(app);
  });

  describe('/cats route', () => {
    it('should return cats', () =>
      request(app)
        .get('/cats')
        .expect(200)
        .then(data => {
          expect(data.body).toEqual([
            {
              name: 'foo',
            },
            {
              name: 'bar',
            },
          ]);
        }));
  });
});
