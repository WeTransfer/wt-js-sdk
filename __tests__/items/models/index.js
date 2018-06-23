const {
  normalizeItem,
  normalizeResponseItem
} = require('../../../src/items/models');

describe('Item model', () => {
  describe('normalizeItem function', () => {
    let item = {};
    beforeEach(() => {
      item = {
        filename: 'filename.txt',
        filesize: 1024,
        content_identifier: 'file',
        local_identifier: 'filename.txt'
      };
    });

    it('should return a normalized file item', () => {
      const file = normalizeItem(item);
      expect(file).toMatchSnapshot();
    });

    it('should return a normalized link item', () => {
      item.content_identifier = 'web_content';
      const link = normalizeItem(item);
      expect(link).toMatchSnapshot();
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, item, { path: '/path/to/file.txt' });
      const file = normalizeItem(extraProps);
      expect(file).toMatchSnapshot();
    });

    it('should throw an error if content_identifier is empty', () => {
      expect(() => normalizeItem({})).toThrowErrorMatchingSnapshot();
    });
  });

  describe('normalizeResponseItem function', () => {
    it('should normalize a file item', () => {
      expect(
        normalizeResponseItem({
          id: 'random-hash',
          content_identifier: 'file',
          local_identifier: 'delightful-cat',
          meta: {
            multipart_parts: 3,
            multipart_upload_id: 'some.random-id--'
          },
          name: 'kittie.gif',
          size: 195906,
          upload_id: 'more.random-ids--',
          upload_expires_at: 1520410633
        })
      ).toMatchSnapshot();
    });

    it('should normalize a link item', () => {
      expect(
        normalizeResponseItem({
          id: 'random-hash',
          content_identifier: 'web_content',
          meta: {
            title: 'WeTransfer'
          },
          url: 'https://wetransfer.com'
        })
      ).toMatchSnapshot();
    });
  });
});
