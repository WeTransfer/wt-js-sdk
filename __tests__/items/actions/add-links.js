const routes = require('../../../src/config/routes');
const addLinksAction = require('../../../src/items/actions/add-links');
const { futureLink, RemoteLink } = require('../../../src/items/models');
const { RemoteTransfer } = require('../../../src/transfer/models');

describe('Add links action', () => {
  let addLinks = null;
  let transfer = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue([
      {
        id: 'random-hash',
        content_identifier: 'web_content',
        meta: {
          title: 'WeTransfer'
        },
        url: 'https://wetransfer.com'
      }
    ]);

    addLinks = addLinksAction({
      routes,
      request: mocks.request,
      futureLink,
      RemoteLink
    });

    transfer = new RemoteTransfer();
  });

  it('should create an add items request', async () => {
    const linkItems = await addLinks(transfer, [
      {
        url: 'https://wetransfer.com',
        meta: {
          title: 'WeTransfer'
        }
      }
    ]);
    expect(linkItems).toMatchSnapshot();
  });
});
