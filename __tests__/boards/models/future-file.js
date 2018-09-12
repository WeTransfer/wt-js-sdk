const { futureFile } = require('../../../src/boards/models');

describe('Future file normalizer', () => {
  describe('futureFile function', () => {
    let file = {};
    beforeEach(() => {
      file = {
        name: 'filename.txt',
        size: 1024,
      };
    });

    it('should return a normalized file item', () => {
      const normalized = futureFile(file);
      expect(normalized).toMatchObject({
        name: 'filename.txt',
        size: 1024,
      });
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, file, { path: '/path/to/file.txt' });
      const normalized = futureFile(extraProps);
      expect(normalized).toEqual({
        name: 'filename.txt',
        size: 1024,
      });
    });
  });
});
