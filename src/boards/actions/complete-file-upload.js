module.exports = function({ request, routes }) {
  /**
   * Marks the file upload as completed
   * @param   {Object} board Board item.
   * @param   {Object} file  File containing information about number of parts, upload url, etc.
   * @returns {Promise}
   */
  return function completeFileUploadToBoard(board, file) {
    return request.send(routes.boards.uploadComplete(board, file));
  };
};
