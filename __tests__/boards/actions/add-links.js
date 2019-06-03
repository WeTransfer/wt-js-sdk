const routes = require('../../../src/config/routes');
const addLinksAction = require('../../../src/boards/actions/add-links');
const { RemoteBoard } = require('../../../src/boards/models');

describe('Add links action', () => {
  let board = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue([
      {
        id: 'random-hash',
        url: 'https://wetransfer.com',
        meta: {
          title: 'WeTransfer',
        },
        type: 'link',
      },
    ]);

    addLinks = addLinksAction({
      routes,
      request: mocks.request,
    });

    board = new RemoteBoard({
      id: 'board-id',
      items: [],
    });
  });

  it('should create an add links request', async () => {
    await addLinks(board, [
      {
        url: 'https://wetransfer.com',
        title: 'WeTransfer',
      },
    ]);
    expect(mocks.request.send).toHaveBeenCalledWith(
      {
        url: '/v2/boards/board-id/links',
        method: 'post',
      },
      [
        {
          url: 'https://wetransfer.com',
          title: 'WeTransfer',
        },
      ]
    );
  });

  it('should return a RemoteLink object', async () => {
    const links = await addLinks(board, [
      {
        url: 'https://wetransfer.com',
        title: 'WeTransfer',
      },
    ]);
    expect(links).toMatchSnapshot();
  });

  it('should throw an error if arguments are not provided', async () => {
    mocks.request.send.mockReturnValue(() =>
      Promise.reject(new Error('Network error.'))
    );

    try {
      await addLinks();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });
});
