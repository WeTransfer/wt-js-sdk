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
    addFiles(collectionId) {
      return { url: `${prefix}/collections/${collectionId}/files` };
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
};
