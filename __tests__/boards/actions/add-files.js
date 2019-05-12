const routes = require('../../../src/config/routes');
const addFilesAction = require('../../../src/boards/actions/add-files');
const { RemoteBoard } = require('../../../src/boards/models');

describe('Add files action', () => {
  let board = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.uploadFileToBoard = jest.fn();
    mocks.request.send.mockReturnValue([
      {
        id: 'random-hash',
        name: 'kittie.gif',
        size: 195906,
        type: 'file',
        multipart: {
          id: 'multipart-id',
          part_numbers: 3,
          chunk_size: 195906,
        },
      },
    ]);

    addFiles = addFilesAction({
      routes,
      request: mocks.request,
      uploadFileToBoard: mocks.uploadFileToBoard,
    });

    board = new RemoteBoard({
      id: 'board-id',
      items: [],
    });
  });

  it('should create an add files request', async () => {
    const files = await addFiles(board, [
      {
        name: 'kittie.gif',
        size: 195906,
      },
    ]);
    expect(files).toMatchSnapshot();
  });

  it('should create an upload file request', async () => {
    const files = await addFiles(board, [
      {
        name: 'kittie.gif',
        size: 195906,
        content: [],
      },
    ]);
    expect(files).toMatchSnapshot();
    expect(mocks.uploadFileToBoard).toHaveBeenCalledWith(
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
