const { normalizeItem, normalizeResponseItem } = require('../models');
const WTError = require('../../error');

module.exports = function({ request, routes }) {
  /**
   * Add items to an existing transfer.
   * @param   {String}  transferId Existing transfer id
   * @param   {Array}   items      A collection of items to be added to the transfer
   * @returns {Promise}            A collection of created items
   */
  return async function addItems(transferId, items) {
    try {
      const transferItems = await request.send(routes.items(transferId), {
        items: items.map(normalizeItem)
      });

      return transferItems.map(normalizeResponseItem);
    } catch (error) {
      throw new WTError(
        'There was an error when adding items to the transfer.',
        error
      );
    }
  };
};
