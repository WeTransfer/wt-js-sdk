const routes = require('../../../src/config/routes');
const uploadFileAction = require('../../../src/transfers/actions/upload-file');

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

    uploadFile = uploadFileAction({
      routes,
      request: mocks.request,
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
          id: 'multipart-id',
          part_numbers: 2,
          chunk_size: 6 * 1024 * 1024,
        },
      },
      []
    );

    expect(mocks.request.send).toHaveBeenCalledWith({
      method: 'get',
      url: '/v2/transfers/transfer-id/files/random-hash/upload-url/2',
    });

    expect(mocks.request.send).toHaveBeenCalledWith({
      method: 'get',
      url: '/v2/transfers/transfer-id/files/random-hash/upload-url/2',
    });

    expect(mocks.request.upload).toHaveBeenCalledWith('s3://very-long-url', []);
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
            chunk_size: 5 * 1024 * 1024,
          },
        },
        []
      );
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });
});
