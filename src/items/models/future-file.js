const { defaults, pick } = require('lodash');

const uuidv4 = require('./uuid');

function defaultFileItem() {
  return {
    filename: '',
    filesize: 0,
    content_identifier: 'file',
    local_identifier: uuidv4(),
  };
}

/**
 * Normalizes a file object. Removes non-expected properties and
 * assigns a default value if key is not defined.
 * @param   {Object} file A file object
 * @returns {Object}      Normalized file object
 */
function normalizeFile(file) {
  const defaultFile = defaultFileItem();
  const normalizedFile = defaults(
    {},
    pick(file, Object.keys(defaultFile)),
    defaultFile
  );

  if (normalizedFile.filesize) {
    normalizedFile.filesize = parseInt(normalizedFile.filesize, 10);
  }

  return normalizedFile;
}

module.exports = normalizeFile;
