module.exports = {
  prefix: '/v1',
  get authorize() {
    return { url: `${this.prefix}/authorize` };
  },
  get transfers() {
    return { url: `${this.prefix}/transfers` };
  },
  items(transferId) {
    return { url: `${this.prefix}/transfers/${transferId}/items` };
  },
  multipart(item, partNumber) {
    return {
      url: `${this.prefix}/files/${item.id}/uploads/${partNumber}/${
        item.meta.multipart_upload_id
      }`,
      method: 'get',
    };
  },
  upload(uploadUrl) {
    return { url: uploadUrl };
  },
  uploadComplete(fileId) {
    return { url: `${this.prefix}/files/${fileId}/uploads/complete` };
  },
};
