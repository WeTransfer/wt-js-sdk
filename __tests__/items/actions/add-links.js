const addLinksAction = require('../../../src/items/actions/add-links');
const { futureLink, RemoteLink } = require('../../../src/items/models');
const { RemoteTransfer } = require('../../../src/transfer/models');

describe('Add links action', () => {
  let addLinks = null;
  let sendItems = null;
  let transfer = null;
  beforeEach(() => {
    sendItems = jest.fn().mockReturnValue([
      {
        id: 'random-hash',
        content_identifier: 'web_content',
        meta: {
          title: 'WeTransfer',
        },
        url: 'https://wetransfer.com',
      },
    ]);

    addLinks = addLinksAction({
      sendItems,
      futureLink,
      RemoteLink,
    });

    transfer = new RemoteTransfer();
  });

  it('should create an add items request', async () => {
    const linkItems = await addLinks(transfer, [
      {
        url: 'https://wetransfer.com',
        meta: {
          title: 'WeTransfer',
        },
      },
    ]);
    expect(linkItems).toMatchSnapshot();
  });
});
