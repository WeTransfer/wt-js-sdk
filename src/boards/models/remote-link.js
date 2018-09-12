class RemoteLink {
  constructor(values) {
    Object.assign(this, values);
  }

  // Select which properties are going to be serialized,
  // to avoid JSON circular references
  toJSON() {
    return {
      id: this.id,
      url: this.url,
      meta: this.meta,
      type: this.type,
    };
  }
}

module.exports = RemoteLink;
