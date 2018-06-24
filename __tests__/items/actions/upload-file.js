const routes = require('../../../src/config/routes');
const uploadFileAction = require('../../../src/items/actions/upload-file');

describe('Upload file action', () => {
  let uploadFile = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = {
      send: jest.fn(),
      upload: jest.fn()
    };
    mocks.request.send.mockReturnValue(
      Promise.resolve({ upload_url: 's3://very-long-url' })
    );

    uploadFile = uploadFileAction({
      routes,
      request: mocks.request
    });
  });

  it('should send one request for a small file', async () => {
    await uploadFile(
      {
        id: 'random-hash',
        content_identifier: 'file',
        local_identifier: 'delightful-cat',
        meta: {
          multipart_parts: 1,
          multipart_upload_id: 'some.random-id--'
        },
        name: 'kittie.gif',
        size: 1
      },
      [0]
    );

    expect(mocks.request.send).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/files/random-hash/uploads/1/some.random-id--'
    });

    expect(mocks.request.upload).toHaveBeenCalledWith('s3://very-long-url', [
      0
    ]);
  });

  it('should send two requests for a 6MB file', async () => {
    const sizeFile = 6 * 1024 * 1024;
    await uploadFile(
      {
        id: 'random-hash',
        content_identifier: 'file',
        local_identifier: 'delightful-cat',
        meta: {
          multipart_parts: 2,
          multipart_upload_id: 'some.random-id--'
        },
        name: 'kittie.gif',
        size: sizeFile
      },
      []
    );

    expect(mocks.request.send).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/files/random-hash/uploads/1/some.random-id--'
    });

    expect(mocks.request.send).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/files/random-hash/uploads/2/some.random-id--'
    });

    expect(mocks.request.upload).toHaveBeenCalledWith('s3://very-long-url', []);
  });

  it('should throw an error if request fails', async () => {
    try {
      mocks.request.send.mockImplementation(() =>
        Promise.reject(new Error('Network error.'))
      );
      await uploadFile(
        {
          id: 'random-hash',
          content_identifier: 'file',
          local_identifier: 'delightful-cat',
          meta: {
            multipart_parts: 1,
            multipart_upload_id: 'some.random-id--'
          },
          name: 'kittie.gif',
          size: 1
        },
        []
      );
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });
});
