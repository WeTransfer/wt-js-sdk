const routes = require('../../../src/config/routes');
const getUploadUrlAction = require('../../../src/boards/actions/get-upload-url');

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
    await getUploadUrl('board-id', 'file-id', 1, 'multipart-upload-id');
    expect(mocks.request.send).toHaveBeenCalledWith({
      method: 'get',
      url: '/v2/boards/board-id/files/file-id/upload-url/1/multipart-upload-id',
    });
  });
});
