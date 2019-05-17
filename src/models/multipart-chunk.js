const { get } = require('lodash');

class MultipartChunk {
  constructor(transferOrBoardId, file, content, partNumber) {
    this.retries = 0;

    this.transferOrBoardId = transferOrBoardId;
    this.file = file;
    this.content = content;
    this.partNumber = partNumber;
  }

  get fileId() {
    return this.file.id;
  }

  get multipartId() {
    return get(this.file, 'multipart.id');
  }
}

module.exports = MultipartChunk;
