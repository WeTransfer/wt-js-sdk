const WTError = require('../../error');
const logger = require('../../config/logger');
const futureTransfer = require('../models/future-transfer');
const RemoteTransfer = require('../models/remote-transfer');

module.exports = function({ request, routes }) {
  /**
   * Creates a new transfer
   * @param   {Object}  transfer A transfer object containing files.
   * @returns {Promise}            A transfer object
   */
  return async function createTransfer(transfer) {
    try {
      logger.info('Creating a new transfer.');
      const response = await request.send(
        routes.transfers.create,
        futureTransfer(transfer)
      );
      logger.info(`Transfer created with id ${response.id}.`);
      return new RemoteTransfer(response);
    } catch (error) {
      throw new WTError(
        'There was an error when creating the transfer.',
        error
      );
    }
  };
};
