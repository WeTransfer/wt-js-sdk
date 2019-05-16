const { RemoteBoard } = require('../../../src/boards/models');

const createRemoteMockFile = require('../../fixtures/create-remote-file');

describe('RemoteBoard model', () => {
  let board = null;
  beforeEach(() => {
    board = new RemoteBoard({
      id: 'random-hash',
      name: 'Little kittens',
      description: 'Something about cats, most probably.',
      state: 'uploading',
      url: 'https://we.tl/s-random-hash',
      items: [],
    });
  });

  describe('contructor', () => {
    it('should create a normalized board', () => {
      expect(board).toMatchSnapshot();
    });

    it('should normalize provided items', () => {
      board = new RemoteBoard({
        id: 'random-hash',
        name: 'Little kittens',
        description: 'Something about cats, most probably.',
        state: 'uploading',
        url: 'https://we.tl/s-random-hash',
        items: [
          createRemoteMockFile(),
          {
            id: 'random-hash',
            url: 'https://wetransfer.com',
            meta: {
              title: 'WeTransfer',
            },
            type: 'link',
          },
        ],
      });

      expect(board.items).toMatchSnapshot();
      expect(board.file).toMatchSnapshot();
      expect(board.links).toMatchSnapshot();
    });
  });

  describe('when items are added to the board', () => {
    beforeEach(() => {
      const files = [createRemoteMockFile()];

      const links = [
        {
          id: 'random-hash',
          url: 'https://wetransfer.com',
          meta: {
            title: 'WeTransfer',
          },
          type: 'link',
        },
      ];

      board.addFiles(...files);
      board.addLinks(...links);
    });

    it('should add items to the board', () => {
      expect(board.items).toMatchSnapshot();
    });

    describe('files property', () => {
      it('should return only files', () => {
        expect(board.files).toMatchSnapshot();
      });
    });

    describe('links property', () => {
      it('should return only links', () => {
        expect(board.links).toMatchSnapshot();
      });
    });
  });
});
