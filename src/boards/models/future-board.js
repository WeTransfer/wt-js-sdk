/**
 * Normalizes a board object. Removes non-expected properties.
 * @param   {Object} board A board object
 * @returns {Object}       Normalized board object
 */
function normalizeBoard(values) {
  return {
    name: values.name,
    description: values.description,
  };
}

module.exports = normalizeBoard;
