const routes = require('../../src/config/routes');
const findAction = require('../../src/actions/find');
const RemoteBoard = require('../../src/boards/models/remote-board');
const RemoteTransfer = require('../../src/transfers/models/remote-transfer');
const WTError = require('../../src/error');

describe('Find action', () => {
  let find = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
  });

  describe('when finding a board', () => {
    beforeEach(() => {
      mocks.request.send.mockReturnValue({
        id: 'board-id',
        name: 'Little kittens',
        description: null,
        state: 'uploading',
        url: 'https://we.tl/s-random-hash',
        items: [],
      });

      find = findAction({
        request: mocks.request,
        findRoute: routes.boards.find,
        RemoteItem: RemoteBoard,
      });
    });

    it('should create a find board request', async () => {
      await find('board-id');
      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/boards/board-id',
      });
    });

    it('should return a RemoteBoard object', async () => {
      const board = await find('board-id');
      expect(board).toMatchSnapshot();
    });

    it('should throw an exception if the request fails', async () => {
      mocks.request.send.mockImplementation(() =>
        Promise.reject(new Error('Network error.'))
      );

      try {
        await find('board-id');
      } catch (error) {
        expect(error).toBeInstanceOf(WTError);
      }
    });
  });

  describe('when finding a transfer', () => {
    beforeEach(() => {
      mocks.request.send.mockReturnValue({
        id: 'board-id',
        message: 'Little kittens',
        state: 'uploading',
        url: 'https://we.tl/s-random-hash',
        files: [],
      });

      find = findAction({
        request: mocks.request,
        findRoute: routes.transfers.find,
        RemoteItem: RemoteTransfer,
      });
    });

    it('should create a find transfer request', async () => {
      await find('transfer-id');
      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/transfers/transfer-id',
      });
    });

    it('should return a RemoteTransfer object', async () => {
      const transfer = await find('transfer-id');
      expect(transfer).toMatchSnapshot();
    });

    it('should throw an exception if the request fails', async () => {
      mocks.request.send.mockImplementation(() =>
        Promise.reject(new Error('Network error.'))
      );

      try {
        await find('transfer-id');
      } catch (error) {
        expect(error).toBeInstanceOf(WTError);
      }
    });
  });
});
