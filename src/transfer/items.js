const WTError = require('../error');
const { normalizeItem, normalizeResponseItem } = require('./model');
const routes = require('../config/routes');
const request = require('../request');

const MIN_CHUNK_SIZE = 5242880;

/**
 * Marks the file upload as completed
 * @param   {Object} item Item containing information about number of parts, upload url, etc.
 * @returns {Promise}
 */
function completeFileUpload(item) {
  return request.send(routes.uploadComplete(item.id));
}

/**
 * Add items to an existing transfer.
 * @param   {String}  transferId Existing transfer id
 * @param   {Array}   items      A collection of items to be added to the transfer
 * @returns {Promise}            A collection of created items
 */
async function addItems(transferId, items) {
  try {
    const transferItems = await request.send(routes.items(transferId), {
      items: items.map(normalizeItem)
    });

    return transferItems.map(normalizeResponseItem);
  } catch (error) {
    throw new WTError(
      'There was an error when adding items to the transfer.',
      error
    );
  }
}

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
 * @returns {Promise}         Empty response if everything goes well 🤔
 */
async function uploadFile(file, content) {
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

  try {
    return await Promise.all(partRequests).then(() => completeFileUpload(file));
  } catch (error) {
    throw new WTError(`There was an error when uploading ${file.name}.`, error);
  }
}

module.exports = {
  addItems,
  uploadFile,
  completeFileUpload
};
