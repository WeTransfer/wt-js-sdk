const logger = require('../config/logger');

module.exports = function({ request, getUploadUrl }) {
  return async function uploadChunk(chunk) {
    logger.debug(
      `[${chunk.file.name}] Uploading ${chunk.content.length} bytes for part #${
        chunk.partNumber
      } to S3`
    );
    const { url } = await getUploadUrl(
      chunk.transferOrBoardId,
      chunk.fileId,
      chunk.partNumber,
      chunk.multipartId
    );
    await request.upload(url, chunk.content);
  };
};
