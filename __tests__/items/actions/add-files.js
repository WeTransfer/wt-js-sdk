const addFilesAction = require('../../../src/items/actions/add-files');
const { futureFile, RemoteFile } = require('../../../src/items/models');
const { RemoteTransfer } = require('../../../src/transfer/models');

describe('Add files action', () => {
  let addFiles = null;
  let sendItems = null;
  let transfer = null;
  beforeEach(() => {
    sendItems = jest.fn().mockReturnValue([
      {
        id: 'random-hash',
        content_identifier: 'file',
        local_identifier: 'delightful-cat',
        meta: {
          multipart_parts: 3,
          multipart_upload_id: 'some.random-id--',
        },
        name: 'kittie.gif',
        size: 195906,
        upload_id: 'more.random-ids--',
        upload_expires_at: 1520410633,
      },
    ]);

    addFiles = addFilesAction({
      sendItems,
      futureFile,
      RemoteFile,
    });

    transfer = new RemoteTransfer();
  });

  it('should create an add items request', async () => {
    const linkFiles = await addFiles(transfer, [
      {
        url: 'https://wetransfer.com',
        meta: {
          title: 'WeTransfer',
        },
      },
    ]);
    expect(linkFiles).toMatchSnapshot();
  });
});
