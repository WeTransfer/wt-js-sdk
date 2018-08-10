class RemoteCollection {
  constructor(values) {
    Object.assign(this, values);
  }

  addFiles(...files) {
    files.forEach((file) => (file.collection = this));
    this.files.push(...files);
  }

  addLinks(...links) {
    links.forEach((link) => (link.collection = this));
    this.links.push(...links);
  }
}

module.exports = RemoteCollection;
