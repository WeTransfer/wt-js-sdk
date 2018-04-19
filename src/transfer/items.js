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
 * Given the file content, and the information related to the chunk
 * that must be uploaded, it returns the data chunk to upload
 * @param   {Buffer} data       File content
 * @param   {Array}  chunkSizes Size of each chunk
 * @param   {Number} parts      Total nuymber of parts
 * @param   {Number} partNumber Actual part number to be uploaded
 * @returns {Buffer}            Data chunk
 */
function extractDataChunk(data, chunkSizes, parts, partNumber) {
  const chunkStart = chunkSizes
    .slice(0, partNumber)
    .reduce((sum, size) => sum + size, 0);
  const chunkEnd =
    partNumber === parts
      ? data.length + 1
      : chunkSizes
        .slice(0, partNumber + 1)
        .reduce((sum, size) => sum + size, 0);
  return data.slice(chunkStart, chunkEnd);
}

/**
 * Given the total size of a file and the number of parts to upload,
 * it returns an array containing the size of each chunk.
 * @example
 * getChunkSizes(5243904) // => [0, 5242880, 1024]
 * @param   {Number} totalSize Content total size, in bytes
 * @returns {Array}            Size of each chunk
 */
function getChunkSizes(totalSize) {
  let partNumber = 0;
  const chunks = [0];

  while (totalSize > MIN_CHUNK_SIZE) {
    chunks[++partNumber] = MIN_CHUNK_SIZE;
    totalSize -= MIN_CHUNK_SIZE;
  }
  chunks[++partNumber] = totalSize;

  return chunks;
}

/**
 * Add items to an existing transfer.
 * @param   {String}  transferId Existing transfer id
 * @param   {Array}   items      A collection of items to be added to the transfer
 * @returns {Promise}            A collection of created items
 */
function addItems(transferId, items) {
  return request
    .send(routes.items(transferId), {
      items: items.map(normalizeItem)
    })
    .then((items) => items.map(normalizeResponseItem));
}

/**
 * Uploads a chunk of the file to S3
 * @param   {Object}  file       Item containing information about number of parts, upload url, etc.
 * @param   {Buffer}  data       File content
 * @param   {Array}   chunkSizes An array containing the chunk size for each part
 * @param   {Number}  partNumber Which part number we want to upload
 * @returns {Promise}            Empty response if everything goes well 🤔
 */
function uploadPart(file, data, chunkSizes, partNumber) {
  return request
    .send(routes.multipart(file, partNumber))
    .then((multipartItem) => {
      return request.upload(
        multipartItem.upload_url,
        extractDataChunk(
          data,
          chunkSizes,
          file.meta.multipart_parts,
          multipartItem.part_number
        )
      );
    });
}

/**
 * Given a file content, and the number of parts that must be uploaded to S3,
 * it chunkes the file and uploads each part in parallel
 * TODO: accept blob as file content as well
 * @param   {Object}  file    Item containing information about number of parts, upload url, etc.
 * @param   {Buffer}  content File content
 * @returns {Promise}         Empty response if everything goes well 🤔
 */
function uploadFile(file, content) {
  const partRequests = [];
  const chunkSizes = getChunkSizes(content.length, file.meta.multipart_parts);

  for (
    let partNumber = 1;
    partNumber <= file.meta.multipart_parts;
    partNumber++
  ) {
    // file.filesize = content.length;
    partRequests.push(uploadPart(file, content, chunkSizes, partNumber));
  }

  return Promise.all(partRequests).then(() => completeFileUpload(file));
}

module.exports = {
  addItems,
  uploadFile,
  completeFileUpload,
  // "Private" methods
  getChunkSizes,
  extractDataChunk
};
