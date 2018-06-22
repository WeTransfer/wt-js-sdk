const { defaults, pick } = require('lodash');

const defaultFileItem = {
  filename: '',
  filesize: 0,
  content_identifier: 'file',
  local_identifier: ''
};

const defaultLinkItem = {
  url: '',
  content_identifier: 'web_content',
  local_identifier: '',
  meta: {
    title: ''
  }
};

/**
 * Decide which model to apply based on the item type
 * @param   {String} type Item type
 * @returns {Object}      Item model
 */
function itemModel(type) {
  switch (type) {
    case 'file':
      return defaultFileItem;
    case 'web_content':
      return defaultLinkItem;
    default:
      throw new WTError(
        'Item\'s content_identifier should be "file" or "web_content".'
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
  const model = itemModel(item.content_identifier);
  const normalizedItem = defaults({}, pick(item, Object.keys(model)), model);

  if (normalizedItem.filesize) {
    normalizedItem.filesize = parseInt(normalizedItem.filesize, 10);
  }

  return normalizedItem;
}

/**
 * Normalizes an item response object. Removes non-expected properties and
 * assigns a default value if key is not defined.
 * @param   {Object} item An item object. Can be a file or a link
 * @returns {Object}      Normalized response item object
 */
function normalizeResponseItem(item) {
  return pick(
    item,
    'id',
    'content_identifier',
    'local_identifier',
    'meta',
    'name',
    'size'
  );
}

module.exports = {
  normalizeItem,
  normalizeResponseItem
};

