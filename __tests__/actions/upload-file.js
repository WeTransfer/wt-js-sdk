const config = require('../../src/config');
const routes = require('../../src/config/routes');
const uploadFileAction = require('../../src/actions/upload-file');
const enqueueChunkAction = require('../../src/actions/queues/chunks-queue');
const getUploadUrlAction = require('../../src/actions/get-upload-url');
const uploadChunkAction = require('../../src/actions/upload-chunk');
const completeFileUploadAction = require('../../src/actions/complete-file-upload');
const { RemoteFile } = require('../../src/models');

describe('Upload file action', () => {
  let file;
  let uploadFile = null;
  const mocks = {};

  beforeEach(() => {
    config.chunkRetries = 0;

    file = new RemoteFile({
      id: 'random-hash',
      name: 'kittie.gif',
      size: 1024,
      multipart: {
        id: 'multipart-id',
        part_numbers: 1,
        chunk_size: 1024,
      },
    });
    mocks.request = {
      send: jest.fn(),
      upload: jest.fn(),
    };
    mocks.request.send.mockReturnValue(
      Promise.resolve({ url: 's3://very-long-url' })
    );
  });

  describe('when uploading files for boards', () => {
    beforeEach(() => {
      uploadFile = uploadFileAction({
        getUploadUrl: getUploadUrlAction({
          request: mocks.request,
          multipartRoute: routes.boards.multipart,
        }),
        enqueueChunk: enqueueChunkAction({
          uploadChunk: uploadChunkAction({ request: mocks.request }),
        }),
        completeFileUpload: completeFileUploadAction({
          request: mocks.request,
          uploadCompleteRoute: routes.boards.uploadComplete,
        }),
      });
    });

    it('should send one request for a small file', async () => {
      await uploadFile({ id: 'board-id' }, file, [0]);

      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/boards/board-id/files/random-hash/upload-url/1/multipart-id',
      });

      expect(mocks.request.upload).toHaveBeenCalledWith('s3://very-long-url', [
        0,
      ]);
    });

    it('should send two requests for a 10MB file', async () => {
      file.size = 10 * 1024 * 1024;
      file.multipart.part_numbers = 2;
      await uploadFile({ id: 'board-id' }, file, []);

      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/boards/board-id/files/random-hash/upload-url/1/multipart-id',
      });

      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/boards/board-id/files/random-hash/upload-url/2/multipart-id',
      });

      expect(mocks.request.upload).toHaveBeenCalledWith(
        's3://very-long-url',
        []
      );
    });

    it('should throw an error if request fails', async () => {
      try {
        mocks.request.send.mockImplementation(() =>
          Promise.reject(new Error('Network error.'))
        );
        await uploadFile({ id: 'board-id' }, file, []);
      } catch (error) {
        expect(error.message).toBe(
          'There was an error when uploading kittie.gif.'
        );
      }
    });
  });

  describe('when uploading files for transfers', () => {
    beforeEach(() => {
      uploadFile = uploadFileAction({
        getUploadUrl: getUploadUrlAction({
          request: mocks.request,
          multipartRoute: routes.transfers.multipart,
        }),
        enqueueChunk: enqueueChunkAction({
          uploadChunk: uploadChunkAction({ request: mocks.request }),
        }),
        completeFileUpload: completeFileUploadAction({
          request: mocks.request,
          uploadCompleteRoute: routes.transfers.uploadComplete,
        }),
      });
    });

    it('should send one request for a small file', async () => {
      await uploadFile({ id: 'transfer-id' }, file, [0]);

      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/transfers/transfer-id/files/random-hash/upload-url/1',
      });

      expect(mocks.request.upload).toHaveBeenCalledWith('s3://very-long-url', [
        0,
      ]);
    });

    it('should send two requests for a 10MB file', async () => {
      file.size = 10 * 1024 * 1024;
      file.multipart.part_numbers = 2;
      await uploadFile({ id: 'transfer-id' }, file, []);

      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/transfers/transfer-id/files/random-hash/upload-url/1',
      });

      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/transfers/transfer-id/files/random-hash/upload-url/2',
      });

      expect(mocks.request.upload).toHaveBeenCalledWith(
        's3://very-long-url',
        []
      );
    });

    it('should throw an error if request fails', async () => {
      try {
        mocks.request.send.mockImplementation(() =>
          Promise.reject(new Error('Network error.'))
        );
        await uploadFile({ id: 'transfer-id' }, file, []);
      } catch (error) {
        expect(error.message).toBe(
          'There was an error when uploading kittie.gif.'
        );
      }
    });
  });
});
