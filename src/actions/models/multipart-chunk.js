const MAX_RETRIES = 5;

class MultipartChunk {
  constructor(file, content, getUploadUrl, partNumber) {
    this.done = false;
    this.retries = 0;

    this.file = file;
    this.content = content;
    this.getUploadUrl = getUploadUrl;
    this.partNumber = partNumber;
  }

  get canRetry() {
    return this.retries < MAX_RETRIES;
  }

  async uploadUrl() {
    return (await this.getUploadUrl()).url;
  }
}

module.exports = MultipartChunk;
