const { RemoteFile } = require('../../../src/items/models');

describe('RemoteFile model', () => {
  let file = null;
  beforeEach(() => {
    file = new RemoteFile({
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
    });
  });

  describe('contructor', () => {
    it('should create a normalized file', () => {
      expect(file).toMatchSnapshot();
    });
  });
});
