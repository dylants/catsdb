const validator = require('./validator');

describe('validator', () => {
  describe('validateRequiredFields', () => {
    const { validateRequiredFields } = validator;

    it('should return no errors when fields are supplied', () => {
      expect(
        validateRequiredFields(
          {
            a: '1',
            b: '2',
          },
          ['a', 'b'],
        ),
      ).toEqual(undefined);
    });

    it('should return an error when fields are not supplied', () => {
      expect(
        validateRequiredFields(
          {
            a: '1',
            b: undefined,
          },
          ['a', 'b'],
        ),
      ).toEqual('b is required');
    });

    it('should return a single error when multiple fields are not supplied', () => {
      expect(
        validateRequiredFields(
          {
            a: undefined,
            b: undefined,
          },
          ['a', 'b'],
        ),
      ).toEqual('a is required');
    });
  });
});
