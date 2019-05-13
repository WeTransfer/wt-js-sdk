class MultipartChunk {
  constructor(file, content, getUploadUrl, partNumber) {
    this.retries = 0;
    this.uploaded = false;

    this.file = file;
    this.content = content;
    this.getUploadUrl = getUploadUrl;
    this.partNumber = partNumber;
  }

  async uploadUrl() {
    return (await this.getUploadUrl()).url;
  }

  uploadComplete() {
    this.uploaded = true;
  }
}

module.exports = MultipartChunk;
