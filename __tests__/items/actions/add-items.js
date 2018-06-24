const routes = require('../../../src/config/routes');
const addItemsAction = require('../../../src/items/actions/add-items');
const {
  normalizeItem,
  normalizeResponseItem
} = require('../../../src/items/models');

describe('Add items action', () => {
  let addItems = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue([
      {
        id: 'random-hash',
        content_identifier: 'file',
        local_identifier: 'delightful-cat',
        meta: {
          multipart_parts: 3,
          multipart_upload_id: 'some.random-id--'
        },
        name: 'kittie.gif',
        size: 195906,
        upload_id: 'more.random-ids--',
        upload_expires_at: 1520410633
      },
      {
        id: 'random-hash',
        content_identifier: 'web_content',
        meta: {
          title: 'WeTransfer'
        },
        url: 'https://wetransfer.com'
      }
    ]);

    addItems = addItemsAction({
      routes,
      request: mocks.request,
      normalizeItem,
      normalizeResponseItem
    });
  });

  it('should create an add items request', async () => {
    const items = await addItems('transfer-id', [
      {
        local_identifier: 'wetransfer.com',
        content_identifier: 'web_content',
        url: 'https://wetransfer.com',
        meta: {
          title: 'WeTransfer'
        }
      }
    ]);
    expect(items).toMatchSnapshot();
  });
});
