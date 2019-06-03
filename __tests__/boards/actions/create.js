const routes = require('../../../src/config/routes');
const createAction = require('../../../src/boards/actions/create');
const WTError = require('../../../src/error');

describe('Create board action', () => {
  let create = null;
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

    create = createAction({
      routes,
      request: mocks.request,
    });
  });

  it('should create a create board request', async () => {
    await create({
      name: 'WeTransfer SDK',
    });
    expect(mocks.request.send).toHaveBeenCalledWith(
      {
        url: '/v2/boards',
        method: 'post',
      },
      {
        name: 'WeTransfer SDK',
      }
    );
  });

  it('should return a RemoteBoard object', async () => {
    const board = await create({
      name: 'WeTransfer SDK',
    });
    expect(board).toMatchSnapshot();
  });

  it('should throw an exception if the request fails', async () => {
    mocks.request.send.mockImplementation(() =>
      Promise.reject(new Error('Network error.'))
    );

    try {
      await create({
        name: 'WeTransfer SDK',
      });
      await authorize();
    } catch (error) {
      expect(error).toBeInstanceOf(WTError);
    }
  });
});
