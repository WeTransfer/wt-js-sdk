class RemoteTransfer {
  constructor(values) {
    Object.assign(this, values);

    this.expires_at = new Date(this.expires_at);
  }
}

module.exports = RemoteTransfer;
