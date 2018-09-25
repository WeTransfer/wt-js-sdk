const WTError = require('../../error');
const logger = require('../../config/logger');
const futureLink = require('../models/future-link');
const RemoteLink = require('../models/remote-link');

module.exports = function({ request, routes }) {
  /**
   * Add links to an existing board.
   * @param   {Object}  board Existing board object
   * @param   {Array}   links A list of links to be added to the board
   * @returns {Promise}       A board with created items
   */
  return async function addLinksToBoard(board, links) {
    try {
      logger.info(`Adding ${links.length} links to board with ID ${board.id}`);
      const response = await request.send(
        routes.boards.addLinks(board),
        links.map(futureLink)
      );
      const boardLinks = response.map((item) => new RemoteLink(item));
      board.addLinks(...boardLinks);

      return boardLinks;
    } catch (error) {
      throw new WTError(
        'There was an error when adding links to the board.',
        error
      );
    }
  };
};
