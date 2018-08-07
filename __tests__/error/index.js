const WTError = require('../../src/error');

describe('Custom exception', () => {
  function throwError(message, raw) {
    throw new WTError(message, raw);
  }

  describe('when error object is empty', () => {
    it('should throw an undefined error', () => {
      expect(throwError).toThrowErrorMatchingSnapshot();
    });
  });

  describe('when error message is provided', () => {
    it('should throw the provided message', () => {
      expect(() => throwError('Random error.')).toThrowErrorMatchingSnapshot();
    });
  });

  describe('when error message and response object are provided', () => {
    it('should throw the provided and response messages', () => {
      const error = {
        response: {
          status: 403,
          data: {
            message: 'Nope',
          },
        },
      };
      expect(() =>
        throwError('Random error.', error)
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('when response object is provided', () => {
    let error;
    beforeEach(() => {
      error = {
        response: {
          status: 201,
          data: {
            message: 'Nope',
          },
        },
      };
    });

    it('should not append a message if status is 200..299', () => {
      expect(() => throwError('', error)).toThrowErrorMatchingSnapshot();
    });

    it('should append a no retry message if status is 400..499', () => {
      error.response.status = 400;
      expect(() => throwError('', error)).toThrowErrorMatchingSnapshot();
    });

    it('should append a retry message if status is 500..504', () => {
      error.response.status = 500;
      expect(() => throwError('', error)).toThrowErrorMatchingSnapshot();
    });

    it('should append a no idea message if status is not expected', () => {
      error.response.status = 999;
      expect(() => throwError('', error)).toThrowErrorMatchingSnapshot();
    });
  });
});
