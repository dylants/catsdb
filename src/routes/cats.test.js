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
    const YELLOW_CAT = {
      birthdate: '2018-08-01',
      breed: 'Yellow',
      id: 1,
      imageUrl: 'http://foo.com',
      name: 'Meow',
      ownedBy: 'sally',
    };
    const GRAY_CAT = {
      birthdate: '2018-01-23',
      breed: 'Gray',
      id: 2,
      imageUrl: 'http://bar.com',
      name: 'Purr',
      ownedBy: 'sally',
    };
    beforeEach(() => {
      setup({
        Cat: {
          findAll: () =>
            Promise.resolve([
              Object.assign({}, YELLOW_CAT, {
                foo: 'bar',
                updatedAt: '2019-05-28 17:27:03',
              }),
              Object.assign({}, GRAY_CAT, {
                foo: 'bar',
                updatedAt: '2019-05-31 17:27:03',
              }),
            ]),
        },
      });
    });

    it('should return the cats requested', () =>
      request(app)
        .get('/cats')
        .expect(200)
        .then(data => {
          expect(data.body).toEqual([GRAY_CAT, YELLOW_CAT]);
        }));

    it.each`
      query                   | body
      ${'id=2'}               | ${[GRAY_CAT]}
      ${'name=Meow'}          | ${[YELLOW_CAT]}
      ${'ownedBy=sally'}      | ${[GRAY_CAT, YELLOW_CAT]}
      ${'id=1&ownedBy=sally'} | ${[YELLOW_CAT]}
      ${'id=2&ownedBy=john'}  | ${[]}
    `(
      'should return the cats requested when filtering is $query',
      ({ query, body }) =>
        request(app)
          .get(`/cats?${query}`)
          .expect(200)
          .then(data => {
            expect(data.body).toEqual(body);
          }),
    );
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

      it.each`
        missing      | body                               | error
        ${'name'}    | ${{}}                              | ${'name is required'}
        ${'ownedBy'} | ${{ name: 'foo' }}                 | ${'ownedBy is required'}
        ${'weight'}  | ${{ name: 'foo', ownedBy: 'bar' }} | ${'weight is required'}
      `('should return 400 without a $missing', ({ body, error }) =>
        request(app)
          .post('/cats')
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
