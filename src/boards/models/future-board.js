/**
 * Normalizes a collection object. Removes non-expected properties.
 * @param   {Object} collection A collection object
 * @returns {Object}            Normalized collection object
 */
function normalizeCollection(values) {
  return {
    name: values.name,
    description: values.description,
  };
}

module.exports = normalizeCollection;
