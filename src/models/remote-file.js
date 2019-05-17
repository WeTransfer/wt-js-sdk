class RemoteFile {
  constructor(values) {
    Object.assign(this, values);

    this.chunks = [];
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
