const { pick } = require('lodash');

class RemoteTransfer {
  constructor(values) {
    this.items = [];
    this.normalizeValues(values);
  }

  normalizeValues(values) {
    Object.assign(
      this,
      pick(values, [
        'description',
        'id',
        'items',
        'local_identifier',
        'name',
        'shortened_url',
        'size'
      ])
    );
  }

  addItems(...items) {
    items.forEach((item) => (item.transfer = this));
    this.items.push(...items);
  }

  get files() {
    return this.items.filter((item) => item.content_identifier === 'file');
  }

  get links() {
    return this.items.filter(
      (item) => item.content_identifier === 'web_content'
    );
  }
}

module.exports = RemoteTransfer;
