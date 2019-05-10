class RemoteFile {
  constructor(values) {
    Object.assign(this, values);

    this.chunks = [];
  }

  onUploadComplete() {
    return new Promise((resolve) => {
      this.uploadCompleted = resolve;
    });
  }

  chunkUploaded() {
    if (this.allChunksUploaded()) {
      this.uploadCompleted();
    }
  }

  allChunksUploaded() {
    return this.chunks.every((chunk) => chunk.done);
  }

  // Select which properties are going to be serialized,
  // to avoid JSON circular references
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      size: this.size,
      multipart: this.multipart,
      type: this.type,
    };
  }
}

module.exports = RemoteFile;
