const nock = require('nock');

const createWTClient = require('../src');

describe('createWTClient function', () => {
  beforeEach(() => {
    nock('https://dev.wetransfer.com')
      .post('/v1/authorize')
      .reply(200);
  });

  it('should return a client if API KEY is provided', async () => {
    try {
      await createWTClient();
    } catch ({ message }) {
      expect(message).toEqual('No API Key provided');
    }
  });

  it('should return an API client', async () => {
    const apiClient = await createWTClient('super-secret-api-key');
    expect(apiClient).toEqual({
      authorize: expect.any(Function),
      transfer: {
        addItems: expect.any(Function),
        completeFileUpload: expect.any(Function),
        create: expect.any(Function),
        uploadFile: expect.any(Function)
      }
    });
  });
});
