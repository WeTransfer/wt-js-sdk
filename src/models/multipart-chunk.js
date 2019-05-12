// TODO: make it part of the client configuration
const MAX_RETRIES = 5;

class MultipartChunk {
  constructor(file, content, getUploadUrl, partNumber) {
    this.retries = 0;
    this.uploaded = false;

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

  uploadComplete() {
    this.uploaded = true;
  }
}

module.exports = MultipartChunk;
