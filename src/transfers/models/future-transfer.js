const normalizeFile = require('./future-file');

/**
 * Normalizes a transfer object. Removes non-expected properties.
 * @param   {Object} transfer A transfer object
 * @returns {Object}          Normalized transfer object
 */
function normalizeTransfer(values) {
  return {
    message: values.message,
    files: (values.files || []).map(normalizeFile),
  };
}

module.exports = normalizeTransfer;
