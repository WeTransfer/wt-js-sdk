const { RemoteCollection } = require('../../../src/collections/models');

describe('RemoteCollection model', () => {
  let collection = null;
  beforeEach(() => {
    collection = new RemoteCollection({
      id: 'random-hash',
      name: 'Little kittens',
      description: 'Something about cats, most probably.',
      state: 'uploading',
      url: 'https://we.tl/s-random-hash',
      files: [],
      links: [],
    });
  });

  describe('contructor', () => {
    it('should create a normalized collection', () => {
      expect(collection).toMatchSnapshot();
    });
  });

  xdescribe('when items are added to the collection', () => {
    beforeEach(() => {
      const files = [
        {
          id: 'random-hash',
          name: 'kittie.gif',
          content_identifier: 'file',
        },
      ];

      const links = [
        {
          id: 'random-hash',
          name: 'wetransfer.com',
          meta: {
            title: 'WeTransfer',
          },
          content_identifier: 'web_content',
        },
      ];

      transfer.addFiles(...files);
      transfer.addLinks(...links);
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
