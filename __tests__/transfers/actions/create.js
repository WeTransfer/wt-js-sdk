const routes = require('../../../src/config/routes');
const createAction = require('../../../src/transfers/actions/create');
const WTError = require('../../../src/error');

const createRemoteMockFile = require('../../fixtures/create-remote-file');
const createLocalMockFile = require('../../fixtures/create-local-file');

describe('Create transfer action', () => {
  let create = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.uploadFileToTransfer = jest.fn();
    mocks.finalizeTransfer = jest.fn((transfer) => transfer);

    mocks.request.send.mockReturnValue({
      id: 'random-hash',
      message: 'Little kittens',
      state: 'uploading',
      files: [createRemoteMockFile()],
      expires_at: '2018-01-01T00:00:00Z',
    });

    create = createAction({
      routes,
      request: mocks.request,
      uploadFileToTransfer: mocks.uploadFileToTransfer,
      finalizeTransfer: mocks.finalizeTransfer,
    });
  });

  it('should create a create transfer request', async () => {
    await create({
      message: 'WeTransfer SDK',
      files: [createLocalMockFile()],
    });
    expect(mocks.request.send).toHaveBeenCalledWith(
      {
        url: '/v2/transfers',
      },
      {
        message: 'WeTransfer SDK',
        files: [createLocalMockFile()],
      }
    );
  });

  it('should return a RemoteTransfer object', async () => {
    const board = await create({
      message: 'WeTransfer SDK',
      files: [createLocalMockFile()],
    });
    expect(board).toMatchSnapshot();
  });

  it('should create an upload file request if content is provided', async () => {
    const transfer = await create({
      message: 'WeTransfer SDK',
      files: [createLocalMockFile({ content: [] })],
    });
    expect(transfer).toMatchSnapshot();
    expect(mocks.uploadFileToTransfer).toHaveBeenCalledWith(
      transfer,
      {
        id: 'random-hash',
        name: 'kittie.gif',
        size: 1024,
        type: 'file',
        multipart: { chunk_size: 1024, id: 'multipart-id', part_numbers: 1 },
        chunks: [],
      },
      []
    );
  });

  it('should create a finalize transfer request if content is provided', async () => {
    const transfer = await create({
      message: 'WeTransfer SDK',
      files: [createLocalMockFile({ content: [] })],
    });
    expect(transfer).toMatchSnapshot(transfer);
    expect(mocks.finalizeTransfer).toHaveBeenCalledWith(transfer);
  });

  it('should throw an exception if the request fails', async () => {
    mocks.request.send.mockImplementation(() =>
      Promise.reject(new Error('Network error.'))
    );

    try {
      await create({
        name: 'WeTransfer SDK',
      });
      await authorize();
    } catch (error) {
      expect(error).toBeInstanceOf(WTError);
    }
  });
});
