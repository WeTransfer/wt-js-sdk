const { pick } = require('lodash');

class RemoteLink {
  constructor(values, transfer) {
    Object.assign(
      this,
      pick(values, ['id', 'content_identifier', 'meta', 'name'])
    );

    this.transfer = transfer;
  }
}

module.exports = RemoteLink;
