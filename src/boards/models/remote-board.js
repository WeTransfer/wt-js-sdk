const RemoteFile = require('./remote-file');
const RemoteLink = require('./remote-link');

class RemoteCollection {
  constructor(values) {
    Object.assign(this, values);

    // this.normalizeItems();
    // this.normalizeLinks();
    // this.normalizeFiles();
  }

//   addFiles(...files) {
//     files.forEach((file) => (file.collection = this));
//     this.files.push(...files);
//   }

//   addLinks(...links) {
//     links.forEach((link) => (link.collection = this));
//     this.links.push(...links);
//   }

//   normalizeFiles() {
//     this.files = this.files.map((file) => new (RemoteFile(file))());
//   }

//   normalizeLinks() {
//     this.links = this.links.map((link) => new (RemoteLink(link))());
//   }
}

module.exports = RemoteCollection;
