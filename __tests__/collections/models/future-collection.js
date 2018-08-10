const { futureCollection } = require('../../../src/collections/models');

describe('Future collection normalizer', () => {
  describe('normalizeCollection function', () => {
    let collection = {};
    beforeEach(() => {
      collection = {
        name: 'WeTransfer rocks',
        description: '',
      };
    });

    it('should return a normalized transfer', () => {
      const normalized = futureCollection(collection);
      expect(normalized).toMatchSnapshot();
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, collection, { date: new Date() });
      const normalized = futureCollection(extraProps);
      expect(normalized).toMatchSnapshot();
    });

    it('add default values', () => {
      const normalized = futureCollection({});
      expect(normalized).toMatchSnapshot();
    });
  });
});
