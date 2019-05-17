const routes = require('../../../src/config/routes');
const addFilesAction = require('../../../src/boards/actions/add-files');
const { RemoteBoard } = require('../../../src/boards/models');

const createRemoteMockFile = require('../../fixtures/create-remote-file');
const createLocalMockFile = require('../../fixtures/create-local-file');

describe('Add files action', () => {
  let board = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.enqueueFileTask = jest.fn(() => Promise.resolve());
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
      enqueueFileTask: mocks.enqueueFileTask,
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
    expect(mocks.enqueueFileTask).toHaveBeenCalledWith({
      transferOrBoard: board,
      file: {
        id: 'random-hash',
        multipart: { chunk_size: 195906, id: 'multipart-id', part_numbers: 3 },
        name: 'kittie.gif',
        size: 195906,
        type: 'file',
        chunks: [],
      },
      content: [],
    });
  });

  it('should throw an error if arguments are not provided', async () => {
    mocks.request.send.mockReturnValue(() =>
      Promise.reject(new Error('Network error.'))
    );

    try {
      await addFiles();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });
});
