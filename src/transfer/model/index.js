const { defaults, pick } = require('lodash');

const defaultTransferItem = {
  name: '',
  description: ''
};

const defaultFileItem = {
  filename: '',
  filesize: 0,
  content_identifier: '',
  local_identifier: ''
};

/**
 * Normalizes a transfer object. Removes non-expected properties and
 * assigns a default value if key is not defined.
 * @param {Object} transfer A transfer object
 * @returns {Object} Normalized transfer object
 */
function normalizeTransfer(transfer) {
  return defaults(
    {},
    pick(transfer, Object.keys(defaultTransferItem)),
    defaultTransferItem
  );
}

/**
 * Normalizes an item object (file or link). Removes non-expected properties and
 * assigns a default value if key is not defined.
 * @param {Object} item An item object. Can be a file or a link
 * @returns {Object} Normalized item object
 */
function normalizeItem(item) {
  // TODO: create different models for files and links
  return defaults(
    {},
    pick(item, Object.keys(defaultFileItem)),
    defaultFileItem
  );
}

module.exports = {
  normalizeTransfer,
  normalizeItem
};
