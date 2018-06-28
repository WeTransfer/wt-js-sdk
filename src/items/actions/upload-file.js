const WTError = require('../../error');

module.exports = function({ request, routes }) {
  const completeFileUpload = require('./complete-file-upload')({
    request,
    routes
  });

  const MAX_CHUNK_SIZE = 6 * 1024 * 1024;

  /**
   * Uploads a chunk of the file to S3
   * @param   {Object}  file       Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  data       File content
   * @param   {Array}   chunkSizes An array containing the chunk size for each part
   * @param   {Number}  partNumber Which part number we want to upload
   * @returns {Promise}            Empty response if everything goes well 🤔
   */
  function uploadPart(file, data, partNumber) {
    return request
      .send(routes.multipart(file, partNumber))
      .then((multipartItem) => {
        return request.upload(multipartItem.upload_url, data);
      });
  }

  /**
   * Given a file content, and the number of parts that must be uploaded to S3,
   * it chunkes the file and uploads each part sequentially
   * @param   {Object}  file    Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  content File content
   * @returns {Array}           Array of part upload promises
   */
  async function uploadAllParts(file, content) {
    for (
      let partNumber = 0;
      partNumber < file.meta.multipart_parts;
      partNumber++
    ) {
      await uploadPart(
        file,
        content.slice(
          partNumber * MAX_CHUNK_SIZE,
          (partNumber + 1) * MAX_CHUNK_SIZE
        ),
        partNumber + 1
      );
    }
  }

  /**
   * Given a file content, and the number of parts that must be uploaded to S3,
   * it chunkes the file and uploads each part sequentially. Completes the file upload at the end.
   * @param   {Object}  file    Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  content File content
   * @returns {Promise}         Empty response if everything goes well 🤔
   */
  return async function uploadFile(file, content) {
    try {
      await uploadAllParts(file, content);
      return await completeFileUpload(file);
    } catch (error) {
      throw new WTError(
        `There was an error when uploading ${file.name}.`,
        error
      );
    }
  };
};
