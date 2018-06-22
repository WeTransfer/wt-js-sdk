module.exports = function({ request, routes }) {
  /**
   * Marks the file upload as completed
   * @param   {Object} item Item containing information about number of parts, upload url, etc.
   * @returns {Promise}
   */
  return function completeFileUpload(item) {
    return request.send(routes.uploadComplete(item.id));
  };
};
