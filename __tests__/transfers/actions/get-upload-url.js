const routes = require('../../../src/config/routes');
const getUploadUrlAction = require('../../../src/transfers/actions/get-upload-url');

describe('Get upload URL action', () => {
  let getUploadUrl = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue(() =>
      Promise.resolve({ url: 's3://very-long-url' })
    );

    getUploadUrl = getUploadUrlAction({
      routes,
      request: mocks.request,
    });
  });

  it('should send a request to retrieve the url', async () => {
    await getUploadUrl('transfer-id', 'file-id', 1);
    expect(mocks.request.send).toHaveBeenCalledWith({
      method: 'get',
      url: '/v2/transfers/transfer-id/files/file-id/upload-url/1',
    });
  });
});
