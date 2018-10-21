const routes = require('../../src/config/routes');
const uploadFileAction = require('../../src/actions/upload-file');
const getUploadUrlAction = require('../../src/actions/get-upload-url');
const completeFileUploadAction = require('../../src/actions/complete-file-upload');

describe('Upload file action', () => {
  let uploadFile = null;
  const mocks = {};
  beforeEach(() => {
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
        request: mocks.request,
        getUploadUrl: getUploadUrlAction({
          request: mocks.request,
          multipartRoute: routes.boards.multipart,
        }),
        completeFileUpload: completeFileUploadAction({
          request: mocks.request,
          uploadCompleteRoute: routes.boards.uploadComplete,
        }),
      });
    });

    it('should send one request for a small file', async () => {
      await uploadFile(
        { id: 'board-id' },
        {
          id: 'random-hash',
          name: 'kittie.gif',
          size: 1024,
          multipart: {
            id: 'multipart-id',
            part_numbers: 1,
            chunk_size: 1024,
          },
        },
        [0]
      );

      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/boards/board-id/files/random-hash/upload-url/1/multipart-id',
      });

      expect(mocks.request.upload).toHaveBeenCalledWith('s3://very-long-url', [
        0,
      ]);
    });

    it('should send two requests for a 10MB file', async () => {
      await uploadFile(
        { id: 'board-id' },
        {
          id: 'random-hash',
          name: 'kittie.gif',
          size: 10 * 1024 * 1024,
          multipart: {
            id: 'multipart-id',
            part_numbers: 2,
            chunk_size: 6 * 1024 * 1024,
          },
        },
        []
      );

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
        await uploadFile(
          { id: 'board-id' },
          {
            id: 'random-hash',
            name: 'kittie.gif',
            size: 10 * 1024 * 1024,
            multipart: {
              id: 'multipart-id',
              part_numbers: 2,
              chunk_size: 6 * 1024 * 1024,
            },
          },
          []
        );
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
        request: mocks.request,
        getUploadUrl: getUploadUrlAction({
          request: mocks.request,
          multipartRoute: routes.transfers.multipart,
        }),
        completeFileUpload: completeFileUploadAction({
          request: mocks.request,
          uploadCompleteRoute: routes.transfers.uploadComplete,
        }),
      });
    });

    it('should send one request for a small file', async () => {
      await uploadFile(
        { id: 'transfer-id' },
        {
          id: 'random-hash',
          name: 'kittie.gif',
          size: 1024,
          multipart: {
            part_numbers: 1,
            chunk_size: 1024,
          },
        },
        [0]
      );

      expect(mocks.request.send).toHaveBeenCalledWith({
        method: 'get',
        url: '/v2/transfers/transfer-id/files/random-hash/upload-url/1',
      });

      expect(mocks.request.upload).toHaveBeenCalledWith('s3://very-long-url', [
        0,
      ]);
    });

    it('should send two requests for a 10MB file', async () => {
      await uploadFile(
        { id: 'transfer-id' },
        {
          id: 'random-hash',
          name: 'kittie.gif',
          size: 10 * 1024 * 1024,
          multipart: {
            part_numbers: 2,
            chunk_size: 6 * 1024 * 1024,
          },
        },
        []
      );

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
        await uploadFile(
          { id: 'transfer-id' },
          {
            id: 'random-hash',
            name: 'kittie.gif',
            size: 10 * 1024 * 1024,
            multipart: {
              part_numbers: 2,
              chunk_size: 6 * 1024 * 1024,
            },
          },
          []
        );
      } catch (error) {
        expect(error.message).toBe(
          'There was an error when uploading kittie.gif.'
        );
      }
    });
  });
});
