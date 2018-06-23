module.exports = function({
  request,
  routes,
  normalizeItem,
  normalizeResponseItem
}) {
  const sendItems = require('./send-items')({ request, routes });

  /**
   * Add items to an existing transfer.
   * @param   {String}  transferId Existing transfer id
   * @param   {Array}   items      A collection of items to be added to the transfer
   * @returns {Promise}            A collection of created items
   */
  return async function addItems(transferId, items) {
    console.warn('DEPRECATED');
    return (await sendItems({ id: transferId }, items.map(normalizeItem))).map(
      normalizeResponseItem
    );
  };
};
