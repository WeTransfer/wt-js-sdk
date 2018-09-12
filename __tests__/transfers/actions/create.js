const routes = require('../../../src/config/routes');
const createAction = require('../../../src/transfers/actions/create');
const WTError = require('../../../src/error');

describe('Create transfer action', () => {
  let create = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.uploadFileToTransfer = jest.fn();
    mocks.finalizeTransfer = jest.fn();
    mocks.finalizeTransfer = mocks.request.send.mockReturnValue({
      id: 'random-hash',
      message: 'Little kittens',
      state: 'uploading',
      files: [
        {
          id: 'random-hash',
          name: 'kittie.gif',
          size: 1024,
          type: 'file',
        },
      ],
    });

    create = createAction({
      routes,
      request: mocks.request,
      uploadFileToTransfer: mocks.uploadFileToTransfer,
      finalizeTransfer: mocks.finalizeTransfer,
    });
  });

  it('should create a new transfer request', async () => {
    const transfer = await create({
      message: 'WeTransfer SDK',
      files: [
        {
          name: 'kittie.gif',
          size: 1024,
        },
      ],
    });
    expect(transfer).toMatchSnapshot();
  });

  it('should create an upload file request if content is provided', async () => {
    const transfer = await create({
      message: 'WeTransfer SDK',
      files: [
        {
          name: 'kittie.gif',
          size: 1024,
          content: [],
        },
      ],
    });
    expect(transfer).toMatchSnapshot();
    expect(mocks.uploadFileToTransfer).toHaveBeenCalledWith(
      transfer,
      { id: 'random-hash', name: 'kittie.gif', size: 1024, type: 'file' },
      []
    );
  });

  it('should create a finalize transfer request if content is provided', async () => {
    const transfer = await create({
      message: 'WeTransfer SDK',
      files: [
        {
          name: 'kittie.gif',
          size: 1024,
          content: [],
        },
      ],
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
