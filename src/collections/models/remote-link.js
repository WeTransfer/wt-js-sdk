const { pick } = require('lodash');

class RemoteLink {
  constructor(values) {
    Object.assign(this, values);
  }

  toJSON() {
    return pick(this, ['id', 'meta', 'url']);
  }
}

module.exports = RemoteLink;
