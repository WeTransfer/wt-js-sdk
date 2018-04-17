const { normalizeTransfer } = require('./model');
const routes = require('../config/routes');
const request = require('../request');

/**
 * Creates a new transfer, without items.
 * @param   {Object}  transfer A transfer object without items.
 * @returns {Promise} A transfer object
 */
function create(transfer) {
  return request.send(routes.transfers, normalizeTransfer(transfer));
}

// async function createAndUpload(transfer) {
//   const collection = await create(transfer);
//   const items = await addItems(id, transfer.items);
//   await Promise.all(items.map(uploadFile));
//   return collection;
// }

module.exports = {
  create
};
