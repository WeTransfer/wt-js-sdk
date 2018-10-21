const routes = require('../../src/config/routes');
const getUploadUrlAction = require('../../src/actions/get-upload-url');

describe('Get upload URL action', () => {
  let getUploadUrl = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue(() =>
      Promise.resolve({ url: 's3://very-long-url' })
    );
  });

  describe('when uploading files for boards', () => {
    beforeEach(() => {
      getUploadUrl = getUploadUrlAction({
        request: mocks.request,
        multipartRoute: routes.boards.multipart,
      });
    });

    it('should send a request to retrieve the upload URL', async () => {
      await getUploadUrl('board-id', 'file-id', 1, 'multipart-upload-id');
      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url:
          '/v2/boards/board-id/files/file-id/upload-url/1/multipart-upload-id',
      });
    });
  });

  describe('when uploading files for transfers', () => {
    beforeEach(() => {
      getUploadUrl = getUploadUrlAction({
        request: mocks.request,
        multipartRoute: routes.transfers.multipart,
      });
    });

    it('should send a request to retrieve the upload URL', async () => {
      await getUploadUrl('transfer-id', 'file-id', 1);
      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/transfers/transfer-id/files/file-id/upload-url/1',
      });
    });
  });
});
