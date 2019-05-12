const { RemoteFile } = require('./../../models');

class RemoteTransfer {
  constructor(values) {
    Object.assign(this, values);

    this.expires_at = new Date(this.expires_at);

    this.normalizeFiles();
  }

  normalizeFiles() {
    this.files = this.files.map((file) => new RemoteFile(file));
  }
}

module.exports = RemoteTransfer;
