module.exports = function({ request, routes }) {
  /**
   * Marks the file upload as completed
   * @param   {Object} file File containing information about number of parts, upload url, etc.
   * @returns {Promise}
   */
  return function completeFileUpload(collection, file) {
    return request.send(routes.collections.uploadComplete(collection, file));
  };
};
