const WTError = require('../../error');
const logger = require('../../config/logger');
const RemoteBoard = require('../models/remote-board');

module.exports = function({ request, routes }) {
  /**
   * Retrieve a board given an id
   * @param   {strint}  boardId An existing? board id
   * @returns {Promise}         A board object
   */
  return async function findBoard(boardId) {
    try {
      logger.info('Retrieving a board.');
      const response = await request.send(routes.boards.find(boardId));
      return new RemoteBoard(response);
    } catch (error) {
      throw new WTError('There was an error when finding the board.', error);
    }
  };
};
