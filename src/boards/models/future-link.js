/**
 * Normalizes a link object. Removes non-expected properties.
 * @param   {Object} link A link object
 * @returns {Object}      Normalized link object
 */
function normalizeLink(link) {
  return {
    url: link.url,
    title: link.title || link.url,
  };
}

module.exports = normalizeLink;
