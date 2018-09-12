const { RemoteLink } = require('../../../src/boards/models');

describe('RemoteLink model', () => {
  let link = null;
  beforeEach(() => {
    link = new RemoteLink({
      id: 'random-hash',
      meta: {
        title: 'WeTransfer',
      },
      url: 'https://wetransfer.com',
      type: 'link',
    });
  });

  describe('contructor', () => {
    it('should create a normalized link', () => {
      expect(link).toMatchSnapshot();
    });
  });
});
