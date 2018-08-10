const { pick } = require('lodash');

class RemoteFile {
  constructor(values) {
    Object.assign(this, values);
  }

  toJSON() {
    return pick(this, ['id', 'name', 'size']);
  }
}

module.exports = RemoteFile;
