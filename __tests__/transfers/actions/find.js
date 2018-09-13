const routes = require('../../../src/config/routes');
const findAction = require('../../../src/transfers/actions/find');
const WTError = require('../../../src/error');

describe('Find transfer action', () => {
  let find = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue({
      id: 'transfer-id',
      message: 'Little kittens',
      state: 'uploading',
      url: 'https://we.tl/t-random-hash',
      files: [
        {
          id: 'random-hash',
          name: 'kittie.gif',
          size: 1024,
          type: 'file',
        },
      ],
    });

    find = findAction({
      routes,
      request: mocks.request,
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
    const board = await find('transfer-id');
    expect(board).toMatchSnapshot();
  });

  it('should throw an exception if the request fails', async () => {
    mocks.request.send.mockImplementation(() =>
      Promise.reject(new Error('Network error.'))
    );

    try {
      await find('random-hash');
    } catch (error) {
      expect(error).toBeInstanceOf(WTError);
    }
  });
});
