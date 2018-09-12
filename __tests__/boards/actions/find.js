const routes = require('../../../src/config/routes');
const findAction = require('../../../src/boards/actions/find');
const WTError = require('../../../src/error');

describe('Find board action', () => {
  let find = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue({
      id: 'random-hash',
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
    const board = await find('random-hash');
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
