const { normalizeTransfer } = require('../../../src/transfer/models');

describe('Transfer model', () => {
  describe('normalizeTransfer function', () => {
    let transfer = {};
    beforeEach(() => {
      transfer = {
        name: 'WeTransfer rocks',
        description: ''
      };
    });

    it('should return a normalized transfer', () => {
      const normalized = normalizeTransfer(transfer);
      expect(normalized).toEqual(transfer);
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, transfer, { date: new Date() });
      const normalized = normalizeTransfer(extraProps);
      expect(normalized).toEqual(transfer);
    });

    it('add default values', () => {
      const normalized = normalizeTransfer({});
      expect(normalized).toEqual({
        name: '',
        description: ''
      });
    });
  });
});
