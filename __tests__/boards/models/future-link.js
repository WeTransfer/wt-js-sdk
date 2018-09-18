const { futureLink } = require('../../../src/boards/models');

describe('Future link normalizer', () => {
  describe('futureLink function', () => {
    let link = {};
    beforeEach(() => {
      link = {
        url: 'https://en.wikipedia.org/wiki/Japan',
        title: 'Japan',
      };
    });

    it('should return a normalized link item', () => {
      const normalized = futureLink(link);
      expect(normalized).toMatchObject({
        url: 'https://en.wikipedia.org/wiki/Japan',
        title: 'Japan',
      });
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, link, { date: new Date() });
      const normalized = futureLink(extraProps);
      expect(normalized).toEqual({
        url: 'https://en.wikipedia.org/wiki/Japan',
        title: 'Japan',
      });
    });
  });
});
