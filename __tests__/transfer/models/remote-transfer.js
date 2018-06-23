const { RemoteTransfer } = require('../../../src/transfer/models');

describe('RemoteTransfer model', () => {
  let transfer = null;
  beforeEach(() => {
    transfer = new RemoteTransfer({
      id: 'random-hash',
      version_identifier: null,
      state: 'uploading',
      shortened_url: 'https://we.tl/s-random-hash',
      name: 'Little kittens',
      description: 'Something about cats, most probably.',
      size: 0,
      total_items: 0,
      items: []
    });
  });

  describe('contructor', () => {
    it('should create a normalized transfer', () => {
      expect(transfer).toMatchSnapshot();
    });
  });

  describe('when items are added to the transfer', () => {
    beforeEach(() => {
      const items = [
        {
          id: 'random-hash',
          name: 'kittie.gif',
          content_identifier: 'file'
        },
        {
          id: 'random-hash',
          name: 'wetransfer.com',
          content_identifier: 'web_content'
        }
      ];
      transfer.addItems(...items);
    });

    it('should add items to the transfer', () => {
      expect(transfer.items).toMatchSnapshot();
    });

    describe('files property', () => {
      it('should return only files', () => {
        expect(transfer.files).toMatchSnapshot();
      });
    });

    describe('links property', () => {
      it('should return only links', () => {
        expect(transfer.links).toMatchSnapshot();
      });
    });
  });
});
