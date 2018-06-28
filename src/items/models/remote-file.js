const { pick } = require('lodash');

class RemoteFile {
  constructor(values) {
    this.normalizeValues(values);
  }

  fileProperties() {
    return [
      'id',
      'content_identifier',
      'local_identifier',
      'meta',
      'name',
      'size'
    ];
  }

  normalizeValues(values) {
    Object.assign(this, pick(values, this.fileProperties()));
  }

  toJSON() {
    return pick(this, this.fileProperties());
  }
}

module.exports = RemoteFile;
