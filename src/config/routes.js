const prefix = '/v2';

module.exports = {
  prefix: '/v2',
  get authorize() {
    return { url: `${prefix}/authorize` };
  },
  collections: {
    get create() {
      return { url: `${prefix}/collections` };
    },
    find(collectionId) {
      return { url: `${prefix}/collections/${collectionId}`, method: 'get' };
    },
    addFiles(collection) {
      return { url: `${prefix}/collections/${collection.id}/files` };
    },
    addLinks(collection) {
      return { url: `${prefix}/collections/${collection.id}/links` };
    },
    multipart(collection, file, partNumber) {
      return {
        url: `${prefix}/collections/${collection.id}/files/${
          file.id
        }/upload-url/${partNumber}/${file.multipart.id}`,
        method: 'get',
      };
    },
    upload(uploadUrl) {
      return { url: uploadUrl };
    },
    uploadComplete(collection, file) {
      return {
        url: `${prefix}/collections/${collection.id}/files/${
          file.id
        }/upload-complete`,
        method: 'put',
      };
    },
  },
  transfers: {
    get create() {
      return { url: `${prefix}/transfers` };
    },
    find(transferId) {
      return { url: `${prefix}/transfers/${transferId}`, method: 'get' };
    },
    multipart(transfer, file, partNumber) {
      return {
        url: `${prefix}/transfers/${transfer.id}/files/${
          file.id
        }/upload-url/${partNumber}`,
        method: 'get',
      };
    },
    upload(uploadUrl) {
      return { url: uploadUrl };
    },
    uploadComplete(transfer, file) {
      return {
        url: `${prefix}/transfers/${transfer.id}/files/${
          file.id
        }/upload-complete`,
        method: 'put',
      };
    },
    finalize(transfer) {
      return {
        url: `${prefix}/transfers/${transfer.id}/finalize`,
        method: 'put',
      };
    },
  },
};
