const routes = require('../../../src/config/routes');
const sendItemsAction = require('../../../src/items/actions/send-items');

describe('Send items action', () => {
  let sendItems = null;
  const mocks = {};
  beforeEach(() => {
    mocks.request = { send: jest.fn() };
    mocks.request.send.mockReturnValue(() =>
      Promise.reject(new Error('Network error.'))
    );

    sendItems = sendItemsAction({
      routes,
      request: mocks.request,
    });
  });

  it('should throw an error if items are not provided', async () => {
    try {
      await sendItems();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });
});
