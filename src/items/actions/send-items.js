const WTError = require('../../error');

module.exports = function({ request, routes }) {
  /**
   * Send items to an existing transfer.
   * @param   {String}  transfer Existing transfer object
   * @param   {Array}   items    A collection of items to be added to the transfer
   * @returns {Promise}          A collection of created items
   */
  return async function sendItems(transfer, items) {
    try {
      return await request.send(routes.items(transfer.id), { items });
    } catch (error) {
      throw new WTError(
        'There was an error when adding items to the transfer.',
        error
      );
    }
  };
};
