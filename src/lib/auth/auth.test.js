const auth = require('./auth');

describe('auth', () => {
  describe('password management', () => {
    it('should be able to hash/validate password', () =>
      auth
        .hashPassword('foo')
        .then(hash => {
          return auth.validatePassword('foo', hash);
        })
        .then(valid => {
          expect(valid).toEqual(true);
        }));

    it('should be able to confirm invalid password', () =>
      auth
        .hashPassword('foo')
        .then(hash => {
          return auth.validatePassword('bar', hash);
        })
        .then(valid => {
          expect(valid).toEqual(false);
        }));
  });
});
