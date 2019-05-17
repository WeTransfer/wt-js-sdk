const routes = require('../../../src/config/routes');
const finalizeAction = require('../../../src/transfers/actions/finalize');
const WTError = require('../../../src/error');

const createRemoteMockFile = require('../../fixtures/create-remote-file');

describe('Finalize transfer action', () => {
  let finalize = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue({
      id: 'random-hash',
      message: 'Little kittens',
      state: 'uploading',
      url: 'https://we.tl/t-random-hash',
      files: [createRemoteMockFile()],
      expires_at: '2018-01-01T00:00:00Z',
    });

    finalize = finalizeAction({
      routes,
      request: mocks.request,
    });
  });

  it('should create a finalize transfer request', async () => {
    const transfer = await finalize({ id: 'transfer-id' });
    expect(transfer).toMatchSnapshot();
  });

  it('should throw an exception if the request fails', async () => {
    mocks.request.send.mockImplementation(() =>
      Promise.reject(new Error('Network error.'))
    );

    try {
      await finalize();
    } catch (error) {
      expect(error).toBeInstanceOf(WTError);
    }
  });
});
