const routes = require('../../../src/config/routes');
const createAction = require('../../../src/transfer/actions/create');
const WTError = require('../../../src/error');

describe('Create transfer action', () => {
  let create = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue({
      id: 'random-hash',
      version_identifier: null,
      state: 'uploading',
      shortened_url: 'https://we.tl/s-random-hash',
      name: 'Little kittens',
      description: null,
      size: 0,
      total_items: 0,
      items: [],
    });

    create = createAction({
      routes,
      request: mocks.request,
    });
  });

  it('should create a new transfer request', async () => {
    const transfer = await create({
      name: 'WeTransfer SDK',
    });
    expect(transfer).toMatchSnapshot();
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
