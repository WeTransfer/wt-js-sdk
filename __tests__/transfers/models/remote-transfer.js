const { RemoteTransfer } = require('../../../src/transfers/models');

describe('RemoteTransfer model', () => {
  let transfer = null;
  beforeEach(() => {
    transfer = new RemoteTransfer({
      id: 'random-hash',
      message: 'Little kittens',
      state: 'uploading',
      url: 'https://we.tl/t-random-hash',
      files: [
        {
          id: 'random-hash',
          name: 'kittie.gif',
          type: 'file',
        },
      ],
    });
  });

  describe('contructor', () => {
    it('should create a normalized transfer', () => {
      expect(transfer).toMatchSnapshot();
    });
  });
});
