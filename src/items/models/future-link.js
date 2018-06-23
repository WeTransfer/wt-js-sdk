const { defaults, pick } = require('lodash');

const uuidv4 = require('./uuid');

function defaultLinkItem() {
  return {
    url: '',
    content_identifier: 'web_content',
    local_identifier: uuidv4(),
    meta: {
      title: ''
    }
  };
}

/**
 * Normalizes a link object. Removes non-expected properties and
 * assigns a default value if key is not defined.
 * @param   {Object} link A link object
 * @returns {Object}      Normalized link object
 */
function normalizeLInk(link) {
  const defaultLink = defaultLinkItem();
  return defaults({}, pick(link, Object.keys(defaultLink)), defaultLink);
}

module.exports = normalizeLInk;
