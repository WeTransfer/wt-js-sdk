const { pick } = require('lodash');

class RemoteLink {
  constructor(values) {
    this.normalizeValues(values);
  }

  linkProperties() {
    return ['id', 'content_identifier', 'meta', 'name'];
  }

  normalizeValues(values) {
    Object.assign(this, pick(values, this.linkProperties()));
  }

  toJSON() {
    return pick(this, this.linkProperties());
  }
}

module.exports = RemoteLink;
