const { get } = require('lodash');

module.exports = function({ request, uploadCompleteRoute }) {
  /**
   * Marks the file upload as completed.
   * @param   {Object} transferOrBoard Transfer or board item.
   * @param   {Object} file            File containing information about number of parts, upload url, etc.
   * @returns {Promise}
   */
  return function completeFileUpload(transferOrBoard, file) {
    const partNumbers = get(file, 'multipart.part_numbers');
    const payload = partNumbers ? { part_numbers: partNumbers } : null;

    return request.send(uploadCompleteRoute(transferOrBoard, file), payload);
  };
};
