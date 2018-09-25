const { futureTransfer } = require('../../../src/transfers/models');

describe('Future transfer normalizer', () => {
  describe('normalizeTransfer function', () => {
    let transfer = {};
    beforeEach(() => {
      transfer = {
        message: 'WeTransfer rocks',
        files: [
          {
            name: 'kittie.gif',
            size: 1024,
          },
        ],
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
  });
});
