const routes = require('../../../src/config/routes');
const createAction = require('../../../src/collections/actions/create-collection');
const WTError = require('../../../src/error');

describe('Create collection action', () => {
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
      files: [],
      links: [],
    });

    create = createAction({
      routes,
      request: mocks.request,
    });
  });

  it('should create a new collection request', async () => {
    const collection = await create({
      name: 'WeTransfer SDK',
    });
    expect(collection).toMatchSnapshot();
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
