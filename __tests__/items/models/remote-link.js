const { RemoteLink } = require('../../../src/items/models');

describe('RemoteLink model', () => {
  let link = null;
  beforeEach(() => {
    link = new RemoteLink({
      id: 'random-hash',
      content_identifier: 'web_content',
      meta: {
        title: 'WeTransfer'
      },
      url: 'https://wetransfer.com'
    });
  });

  describe('contructor', () => {
    it('should create a normalized link', () => {
      expect(link).toMatchSnapshot();
    });
  });
});
