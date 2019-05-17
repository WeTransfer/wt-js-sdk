const { RemoteTransfer } = require('../../../src/transfers/models');

const createRemoteMockFile = require('../../fixtures/create-remote-file');

describe('RemoteTransfer model', () => {
  let transfer = null;
  beforeEach(() => {
    transfer = new RemoteTransfer({
      id: 'random-hash',
      message: 'Little kittens',
      state: 'uploading',
      url: 'https://we.tl/t-random-hash',
      files: [createRemoteMockFile()],
      expires_at: '2018-01-01T00:00:00Z',
    });
  });

  describe('contructor', () => {
    it('should create a normalized transfer', () => {
      expect(transfer).toMatchSnapshot();
    });
  });
});
