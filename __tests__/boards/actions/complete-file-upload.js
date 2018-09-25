const routes = require('../../../src/config/routes');
const completeFileUploadAction = require('../../../src/boards/actions/complete-file-upload');

describe('Complete file upload action', () => {
  let completeFileUpload = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };

    completeFileUpload = completeFileUploadAction({
      routes,
      request: mocks.request,
    });
  });

  it('should create a complete file upload request', async () => {
    await completeFileUpload({ id: 'board-id' }, { id: 'file-id' });
    expect(mocks.request.send).toHaveBeenCalledWith({
      method: 'put',
      url: '/v2/boards/board-id/files/file-id/upload-complete',
    });
  });
});
