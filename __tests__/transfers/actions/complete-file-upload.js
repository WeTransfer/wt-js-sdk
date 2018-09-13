const routes = require('../../../src/config/routes');
const completeFileUploadAction = require('../../../src/transfers/actions/complete-file-upload');

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
