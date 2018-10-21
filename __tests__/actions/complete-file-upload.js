const routes = require('../../src/config/routes');
const completeFileUploadAction = require('../../src/actions/complete-file-upload');

describe('Complete file upload action', () => {
  let completeFileUpload = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
  });

  describe('when completing file upload for boards', () => {
    beforeEach(() => {
      completeFileUpload = completeFileUploadAction({
        request: mocks.request,
        uploadCompleteRoute: routes.boards.uploadComplete,
      });
    });

    it('should create a complete file upload request', async () => {
      await completeFileUpload({ id: 'board-id' }, { id: 'file-id' });
      expect(mocks.request.send).toHaveBeenCalledWith(
        {
          method: 'put',
          url: '/v2/boards/board-id/files/file-id/upload-complete',
        },
        null
      );
    });
  });

  describe('when completing file upload for transfers', () => {
    beforeEach(() => {
      completeFileUpload = completeFileUploadAction({
        request: mocks.request,
        uploadCompleteRoute: routes.transfers.uploadComplete,
      });
    });

    it('should create a complete file upload request', async () => {
      await completeFileUpload(
        { id: 'transfer-id' },
        { id: 'file-id', multipart: { part_numbers: 2 } }
      );
      expect(mocks.request.send).toHaveBeenCalledWith(
        {
          method: 'put',
          url: '/v2/transfers/transfer-id/files/file-id/upload-complete',
        },
        { part_numbers: 2 }
      );
    });
  });
});
