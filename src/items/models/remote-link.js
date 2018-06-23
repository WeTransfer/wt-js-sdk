const { pick } = require('lodash');

class RemoteLink {
  constructor(values) {
    this.normalizeValues(values);
  }

  normalizeValues(values) {
    Object.assign(
      this,
      pick(values, ['id', 'content_identifier', 'meta', 'name'])
    );
  }
}

module.exports = RemoteLink;
