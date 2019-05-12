const { RemoteFile } = require('./../../models');
const RemoteLink = require('./remote-link');

class RemoteBoard {
  constructor(values) {
    Object.assign(this, values);

    this.normalizeItems();
  }

  normalizeItems() {
    this.items = this.items.map((item) => {
      switch (item.type) {
        case 'link':
          return new RemoteLink(item);
        case 'file':
          return new RemoteFile(item);
      }
    });
  }

  addLinks(...links) {
    const remoteLinks = links.map((link) => {
      const remoteLink = new RemoteLink(link);
      remoteLink.board = this;

      return remoteLink;
    });

    this.items.push(...remoteLinks);
  }

  addFiles(...files) {
    const remoteFiles = files.map((file) => {
      const remoteFile = new RemoteFile(file);
      remoteFile.board = this;

      return remoteFile;
    });

    this.items.push(...remoteFiles);
  }

  get links() {
    return this.items.filter((item) => item.type === 'link');
  }

  get files() {
    return this.items.filter((item) => item.type === 'file');
  }
}

module.exports = RemoteBoard;
