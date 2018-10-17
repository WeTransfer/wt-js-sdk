const sanitizeFileName = require('../../utils/sanitize-filename');

/**
 * Normalizes a file object. Removes non-expected properties.
 * @param   {Object} file A file object
 * @returns {Object}      Normalized file object
 */
function normalizeFile(file) {
  return {
    name: sanitizeFileName(file.name),
    size: file.size,
  };
}

module.exports = normalizeFile;
