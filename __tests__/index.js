const nock = require('nock');

const createWTClient = require('../src');

describe('createWTClient function', () => {
  beforeEach(() => {
    nock('https://dev.wetransfer.com')
      .post('/v1/authorize')
      .reply(200);
  });

  it('should return a client if API KEY is provided', async () => {
    const apiClient = await createWTClient('super-secret-api-key', {
      logger: {
        level: 'error'
      }
    });

    expect(apiClient).toEqual({
      authorize: expect.any(Function),
      transfer: {
        addFiles: expect.any(Function),
        addItems: expect.any(Function),
        addLinks: expect.any(Function),
        completeFileUpload: expect.any(Function),
        create: expect.any(Function),
        uploadFile: expect.any(Function)
      },
      file: {
        getUploadURL: expect.any(Function)
      }
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
