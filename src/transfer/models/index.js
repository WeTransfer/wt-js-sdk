const { defaults, pick } = require('lodash');

const defaultTransferItem = {
  name: '',
  description: ''
};

/**
 * Normalizes a transfer object. Removes non-expected properties and
 * assigns a default value if key is not defined.
 * @param   {Object} transfer A transfer object
 * @returns {Object}          Normalized transfer object
 */
function normalizeTransfer(transfer) {
  return defaults(
    {},
    pick(transfer, Object.keys(defaultTransferItem)),
    defaultTransferItem
  );
}

module.exports = {
  normalizeTransfer
};
