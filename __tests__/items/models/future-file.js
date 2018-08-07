const { futureFile } = require('../../../src/items/models');

describe('Future file normalizer', () => {
  describe('futureFile function', () => {
    let file = {};
    beforeEach(() => {
      file = {
        filename: 'filename.txt',
        filesize: 1024,
      };
    });

    it('should return a normalized file item', () => {
      const normalized = futureFile(file);
      expect(normalized).toMatchObject({
        filename: 'filename.txt',
        filesize: 1024,
        content_identifier: 'file',
        local_identifier: expect.any(String),
      });
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, file, { path: '/path/to/file.txt' });
      const normalized = futureFile(extraProps);
      expect(normalized).toEqual({
        filename: 'filename.txt',
        filesize: 1024,
        content_identifier: 'file',
        local_identifier: expect.any(String),
      });
    });

    it('should set default properties', () => {
      delete file.filesize;
      const normalized = futureFile(file);
      expect(normalized).toEqual({
        filename: 'filename.txt',
        filesize: 0,
        content_identifier: 'file',
        local_identifier: expect.any(String),
      });
    });
  });
});
