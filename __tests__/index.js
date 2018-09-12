const nock = require('nock');

const createWTClient = require('../src');

describe('createWTClient function', () => {
  beforeEach(() => {
    nock('https://dev.wetransfer.com')
      .post('/v2/authorize')
      .reply(200);
  });

  it('should return a client if API KEY is provided', async () => {
    const apiClient = await createWTClient('super-secret-api-key', {
      logger: {
        level: 'error',
      },
    });

    expect(apiClient).toEqual({
      authorize: expect.any(Function),
      board: {
        create: expect.any(Function),
        find: expect.any(Function),
        addFiles: expect.any(Function),
        addLinks: expect.any(Function),
        getFileUploadURL: expect.any(Function),
        completeFileUpload: expect.any(Function),
      },
      transfer: {
        create: expect.any(Function),
        find: expect.any(Function),
        getFileUploadURL: expect.any(Function),
        completeFileUpload: expect.any(Function),
        finalize: expect.any(Function),
      },
    });
  });

  it('should throw and error when no API KEY is provided', async () => {
    try {
      await createWTClient();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });
});
