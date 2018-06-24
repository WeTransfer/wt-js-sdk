const WTError = require('../../error');

module.exports = function({ request, routes }) {
  const completeFileUpload = require('./complete-file-upload')({
    request,
    routes
  });

  const MIN_CHUNK_SIZE = 5242880;

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
   * it chunkes the file and uploads each part in parallel
   * @param   {Object}  file    Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  content File content
   * @returns {Array}           Array of part upload promises
   */
  function uploadAllParts(file, content) {
    const partRequests = [];

    for (
      let partNumber = 0;
      partNumber < file.meta.multipart_parts;
      partNumber++
    ) {
      partRequests.push(
        uploadPart(
          file,
          content.slice(
            partNumber * MIN_CHUNK_SIZE,
            (partNumber + 1) * MIN_CHUNK_SIZE
          ),
          partNumber + 1
        )
      );
    }

    return partRequests;
  }

  /**
   * Given a file content, and the number of parts that must be uploaded to S3,
   * it chunkes the file and uploads each part in parallel. Completes the file upload at the end.
   * @param   {Object}  file    Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  content File content
   * @returns {Promise}         Empty response if everything goes well 🤔
   */
  return async function uploadFile(file, content) {
    try {
      const partRequests = uploadAllParts(file, content);
      return await Promise.all(partRequests).then(() =>
        completeFileUpload(file)
      );
    } catch (error) {
      throw new WTError(
        `There was an error when uploading ${file.name}.`,
        error
      );
    }
  };
};
