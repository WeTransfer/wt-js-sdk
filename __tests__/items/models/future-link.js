const { futureLink } = require('../../../src/items/models');

describe('Future link normalizer', () => {
  describe('futureLink function', () => {
    let link = {};
    beforeEach(() => {
      link = {
        url: 'https://en.wikipedia.org/wiki/Japan',
        meta: {
          title: 'Japan',
        },
      };
    });

    it('should return a normalized link item', () => {
      const normalized = futureLink(link);
      expect(normalized).toMatchObject({
        url: 'https://en.wikipedia.org/wiki/Japan',
        meta: {
          title: 'Japan',
        },
        content_identifier: 'web_content',
        local_identifier: expect.any(String),
      });
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, link, { date: new Date() });
      const normalized = futureLink(extraProps);
      expect(normalized).toEqual({
        url: 'https://en.wikipedia.org/wiki/Japan',
        meta: {
          title: 'Japan',
        },
        content_identifier: 'web_content',
        local_identifier: expect.any(String),
      });
    });

    it('should set default properties', () => {
      delete link.url;
      const normalized = futureLink(link);
      expect(normalized).toEqual({
        url: '',
        meta: {
          title: 'Japan',
        },
        content_identifier: 'web_content',
        local_identifier: expect.any(String),
      });
    });
  });
});
