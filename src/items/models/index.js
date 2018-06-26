const futureLink = require('./future-link');
const futureFile = require('./future-file');
const RemoteFile = require('./remote-file');
const RemoteLink = require('./remote-link');

const WTError = require('../../error');

/**
 * Decide which model to apply based on the item type
 * @param   {String} type Item type
 * @returns {Object}      Item model
 */
function normalizer(type, normalizers) {
  switch (type) {
    case 'file':
    case 'web_content':
      return normalizers[type];
    default:
      throw new WTError(
        'Item\'s content_identifier property should be "file" or "web_content".'
      );
  }
}

/**
 * Normalizes an item object (file or link). Removes non-expected properties and
 * assigns a default value if key is not defined.
 * @param   {Object} item An item object. Can be a file or a link
 * @returns {Object}      Normalized item object
 */
function normalizeItem(item) {
  const normalizers = {
    file: futureFile,
    web_content: futureLink
  };

  return normalizer(item.content_identifier, normalizers)(item);
}

/**
 * Normalizes an item response object. Removes non-expected properties and
 * assigns a default value if key is not defined.
 * @param   {Object} item An item object. Can be a file or a link
 * @returns {Object}      Normalized response item object
 */
function normalizeResponseItem(item) {
  const normalizers = {
    file: RemoteFile,
    web_content: RemoteLink
  };

  const RemoteItem = normalizer(item.content_identifier, normalizers);
  return new RemoteItem(item);
}

module.exports = {
  futureLink,
  futureFile,
  RemoteFile,
  RemoteLink,
  normalizeItem,
  normalizeResponseItem
};
