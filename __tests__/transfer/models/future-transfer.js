const { futureTransfer } = require('../../../src/transfer/models');

describe('Future transfer normalizer', () => {
  describe('normalizeTransfer function', () => {
    let transfer = {};
    beforeEach(() => {
      transfer = {
        name: 'WeTransfer rocks',
        description: ''
      };
    });

    it('should return a normalized transfer', () => {
      const normalized = futureTransfer(transfer);
      expect(normalized).toMatchSnapshot();
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, transfer, { date: new Date() });
      const normalized = futureTransfer(extraProps);
      expect(normalized).toMatchSnapshot();
    });

    it('add default values', () => {
      const normalized = futureTransfer({});
      expect(normalized).toMatchSnapshot();
    });
  });
});
