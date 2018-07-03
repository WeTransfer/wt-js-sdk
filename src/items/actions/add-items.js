const logger = require('../../config/logger');

module.exports = function({ sendItems, normalizeItem, normalizeResponseItem }) {
  /**
   * Add items to an existing transfer.
   * @param   {String}  transferId Existing transfer id
   * @param   {Array}   items      A collection of items to be added to the transfer
   * @returns {Promise}            A collection of created items
   */
  return async function addItems(transferId, items) {
    logger.warn(
      '[DEPRECATED]: addItems method will be removed in future versions. Please use addFiles or addLinks methods instead.'
    );
    return (await sendItems({ id: transferId }, items.map(normalizeItem))).map(
      normalizeResponseItem
    );
  };
};
