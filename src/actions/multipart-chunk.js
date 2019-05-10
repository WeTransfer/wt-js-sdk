class MultipartChunk {
  constructor(file, content, getUploadUrl) {
    this.file = file;
    this.content = content;
    this.getUploadUrl = getUploadUrl;

    this.done = false;
  }

  get canRetry() {
    return true;
  }

  async uploadUrl() {
    const { url } = await this.getUploadUrl();
    return url;
  }

  complete() {
    this.done = true;
    this.file.chunkUploaded();
  }
}

module.exports = MultipartChunk;
