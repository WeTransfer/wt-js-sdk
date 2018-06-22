const WTError = require('../../error');
const { normalizeTransfer } = require('./../models');

module.exports = function({ request, routes }) {
  /**
   * Creates a new transfer, without items.
   * @param   {Object}  transfer A transfer object without items.
   * @returns {Promise}          A transfer object
   */
  return async function createTransfer(transfer) {
    try {
      return await request.send(routes.transfers, normalizeTransfer(transfer));
    } catch (error) {
      throw new WTError(
        'There was an error when creating the transfer.',
        error
      );
    }
  };
};
