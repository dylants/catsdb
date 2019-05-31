const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');

describe('cats routes', () => {
  let app;

  function setup(mockModels) {
    app = express();
    app.use(bodyParser.json());

    jest.resetModules();
    jest.restoreAllMocks();
    jest.mock('../models', () => mockModels);

    const routes = require('./cats');
    routes(app);
  }

  describe('/cats GET route', () => {
    beforeEach(() => {
      setup({
        Cat: {
          findAll: () =>
            Promise.resolve([
              {
                birthdate: '2018-08-01',
                breed: 'Yellow',
                foo: 'bar',
                id: 1,
                imageUrl: 'http://foo.com',
                name: 'Meow',
                ownedBy: 'sally',
                updatedAt: '2019-05-28 17:27:03',
              },
              {
                birthdate: '2018-01-23',
                breed: 'Gray',
                foo: 'bar',
                id: 2,
                imageUrl: 'http://bar.com',
                name: 'Purr',
                ownedBy: 'sally',
                updatedAt: '2019-05-31 17:27:03',
              },
            ]),
        },
      });
    });

    it('should return the cats requested', () =>
      request(app)
        .get('/cats')
        .expect(200)
        .then(data => {
          expect(data.body).toEqual([
            {
              birthdate: '2018-01-23',
              breed: 'Gray',
              id: 2,
              imageUrl: 'http://bar.com',
              name: 'Purr',
              ownedBy: 'sally',
            },
            {
              birthdate: '2018-08-01',
              breed: 'Yellow',
              id: 1,
              imageUrl: 'http://foo.com',
              name: 'Meow',
              ownedBy: 'sally',
            },
          ]);
        }));

    it('should return the cats requested when filtering is enabled', () =>
      request(app)
        .get('/cats?id=2')
        .expect(200)
        .then(data => {
          expect(data.body).toEqual([
            {
              birthdate: '2018-01-23',
              breed: 'Gray',
              id: 2,
              imageUrl: 'http://bar.com',
              name: 'Purr',
              ownedBy: 'sally',
            },
          ]);
        }));
  });

  describe('/cats POST route', () => {
    const VALID_INPUT = {
      name: 'Meow',
      ownedBy: 'sally',
      breed: 'Yellow',
      birthdate: '2018-08-01',
      imageUrl: 'http://cat.com',
      weight: 10,
    };

    describe('when create succeeds', () => {
      beforeEach(() => {
        setup({
          Cat: {
            create: () => Promise.resolve(),
          },
        });
      });

      it('should return 400 without a name', () =>
        request(app)
          .post('/cats')
          .send({})
          .expect(400)
          .then(data => {
            expect(data.body).toEqual({
              error: 'name is required',
            });
          }));

      it('should return 204 with valid data', () =>
        request(app)
          .post('/cats')
          .send(VALID_INPUT)
          .expect(204));
    });

    describe('when create fails', () => {
      beforeEach(() => {
        setup({
          Cat: {
            create: () => Promise.reject(),
          },
        });
      });

      it('should return 500', () =>
        request(app)
          .post('/cats')
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
