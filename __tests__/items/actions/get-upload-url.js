const routes = require('../../../src/config/routes');
const getUploadUrlAction = require('../../../src/items/actions/get-upload-url');

describe('Get upload URL action', () => {
  let getUploadUrl = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue(() =>
      Promise.resolve({ upload_url: 's3://very-long-url' })
    );

    getUploadUrl = getUploadUrlAction({
      routes,
      request: mocks.request
    });
  });

  it('should send a request to retrieve the url', async () => {
    await getUploadUrl(
      {
        id: 'file-id',
        meta: {
          multipart_upload_id: 'multipart-upload-id'
        }
      },
      1
    );
    expect(mocks.request.send).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/files/file-id/uploads/1/multipart-upload-id'
    });
  });
});
