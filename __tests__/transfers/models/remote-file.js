const { RemoteFile } = require('../../../src/transfers/models');

describe('RemoteFile model', () => {
  let file = null;
  beforeEach(() => {
    file = new RemoteFile({
      id: 'random-hash',
      multipart: {
        parts_numbers: 3,
        chunk_size: 195906,
      },
      name: 'kittie.gif',
      size: 195906,
      type: 'file',
    });
  });

  describe('contructor', () => {
    it('should create a normalized file', () => {
      expect(file).toMatchSnapshot();
    });
  });
});
