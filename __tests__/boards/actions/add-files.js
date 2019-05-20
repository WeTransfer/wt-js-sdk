const routes = require('../../../src/config/routes');
const addFilesAction = require('../../../src/boards/actions/add-files');
const enqueueFileTaskAction = require('../../../src/actions/queues/files-queue');
const { RemoteBoard } = require('../../../src/boards/models');

const createRemoteMockFile = require('../../fixtures/create-remote-file');
const createLocalMockFile = require('../../fixtures/create-local-file');

describe('Add files action', () => {
  let board = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.uploadFile = jest.fn();
    mocks.request.send.mockReturnValue([
      createRemoteMockFile({
        size: 195906,
        multipart: {
          id: 'multipart-id',
          part_numbers: 3,
          chunk_size: 195906,
        },
      }),
    ]);

    addFiles = addFilesAction({
      routes,
      request: mocks.request,
      enqueueFileTask: enqueueFileTaskAction({
        uploadFile: mocks.uploadFile,
      }),
    });

    board = new RemoteBoard({
      id: 'board-id',
      items: [],
    });
  });

  it('should create an add files request', async () => {
    const files = await addFiles(board, [createLocalMockFile()]);
    expect(files).toMatchSnapshot();
  });

  it('should create an upload file request', async () => {
    const files = await addFiles(board, [createLocalMockFile({ content: [] })]);
    expect(files).toMatchSnapshot();
    expect(mocks.uploadFile).toHaveBeenCalledWith(
      board,
      {
        id: 'random-hash',
        multipart: { chunk_size: 195906, id: 'multipart-id', part_numbers: 3 },
        name: 'kittie.gif',
        size: 195906,
        type: 'file',
        chunks: [],
      },
      []
    );
  });

  it('should throw an error if request fails', async () => {
    mocks.uploadFile.mockImplementation(() =>
      Promise.reject(new Error('Network error.'))
    );
    await expect(
      addFiles(board, [createLocalMockFile({ content: [] })])
    ).rejects.toThrow('There was an error when adding files to the board.');
  });

  it('should throw an error if arguments are not provided', async () => {
    mocks.request.send.mockReturnValue(() =>
      Promise.reject(new Error('Network error.'))
    );
    await expect(addFiles()).rejects.toThrow(
      'There was an error when adding files to the board.'
    );
  });
});
