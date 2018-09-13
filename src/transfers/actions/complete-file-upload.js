module.exports = function({ request, routes }) {
  /**
   * Marks the file upload as completed
   * @param   {Object} transfer Transfer item.
   * @param   {Object} file     File containing information about number of parts, upload url, etc.
   * @returns {Promise}
   */
  return function completeFileUploadToTransfer(transfer, file) {
    return request.send(routes.transfers.uploadComplete(transfer, file), {
      part_numbers: file.multipart.part_numbers,
    });
  };
};
