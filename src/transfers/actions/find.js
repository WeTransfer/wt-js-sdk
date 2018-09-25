const WTError = require('../../error');
const logger = require('../../config/logger');
const { RemoteTransfer } = require('../models');

module.exports = function({ request, routes }) {
  /**
   * Retrieve a transfer given an id
   * @param   {strint}  transferId An existing? transfer id
   * @returns {Promise}            A transfer object
   */
  return async function findTransfer(transferId) {
    try {
      logger.info('Retrieving a transfer.');
      const response = await request.send(routes.transfers.find(transferId));
      return new RemoteTransfer(response);
    } catch (error) {
      throw new WTError('There was an error when finding the transfer.', error);
    }
  };
};
