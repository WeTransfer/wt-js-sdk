const RemoteFile = require('./remote-file');

class RemoteTransfer {
  constructor(values) {
    Object.assign(this, values);

    this.expires_at = new Date(this.expires_at);

    this.processFiles();
  }

  processFiles() {
    this.files = this.files.map((file) => new RemoteFile(file));
  }
}

module.exports = RemoteTransfer;
