const { pick } = require('lodash');

class RemoteFile {
  constructor(values) {
    this.normalizeValues(values);
  }

  normalizeValues(values) {
    Object.assign(
      this,
      pick(values, [
        'id',
        'content_identifier',
        'local_identifier',
        'meta',
        'name',
        'size'
      ])
    );
  }
}

module.exports = RemoteFile;
