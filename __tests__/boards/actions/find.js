const routes = require('../../../src/config/routes');
const findAction = require('../../../src/boards/actions/find');
const WTError = require('../../../src/error');

describe('Find board action', () => {
  let find = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue({
      id: 'board-id',
      name: 'Little kittens',
      description: null,
      state: 'uploading',
      url: 'https://we.tl/s-random-hash',
      items: [],
    });

    find = findAction({
      routes,
      request: mocks.request,
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
