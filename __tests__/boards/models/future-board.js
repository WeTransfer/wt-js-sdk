const { futureBoard } = require('../../../src/boards/models');

describe('Future board normalizer', () => {
  describe('normalizeBoard function', () => {
    let board = {};
    beforeEach(() => {
      board = {
        name: 'WeTransfer rocks',
        description: '',
      };
    });

    it('should return a normalized board', () => {
      const normalized = futureBoard(board);
      expect(normalized).toMatchSnapshot();
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, board, { date: new Date() });
      const normalized = futureBoard(extraProps);
      expect(normalized).toMatchSnapshot();
    });
  });
});
