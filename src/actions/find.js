const WTError = require('../error');
const logger = require('../config/logger');

module.exports = function({ request, findRoute, RemoteItem }) {
  /**
   * Retrieve a transfer or board given an id
   * @param   {strint}  id An existing transfer or board id
   * @returns {Promise}    A transfer or board object
   */
  return async function find(id) {
    try {
      logger.info(`Retrieving a ${RemoteItem.name}.`);
      const response = await request.send(findRoute(id));
      return new RemoteItem(response);
    } catch (error) {
      throw new WTError(
        `There was an error when finding the ${RemoteItem.name}.`,
        error
      );
    }
  };
};
