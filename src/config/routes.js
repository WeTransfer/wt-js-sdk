const prefix = '/v2';

module.exports = {
  prefix: '/v2',
  get authorize() {
    return { url: `${prefix}/authorize` };
  },
  boards: {
    get create() {
      return { url: `${prefix}/boards` };
    },
    find(boardId) {
      return { url: `${prefix}/boards/${boardId}`, method: 'get' };
    },
    addFiles(board) {
      return { url: `${prefix}/boards/${board.id}/files` };
    },
    addLinks(board) {
      return { url: `${prefix}/boards/${board.id}/links` };
    },
    multipart(board, file, partNumber) {
      return {
        url: `${prefix}/boards/${board.id}/files/${
          file.id
        }/upload-url/${partNumber}/${file.multipart.id}`,
        method: 'get',
      };
    },
    upload(uploadUrl) {
      return { url: uploadUrl };
    },
    uploadComplete(board, file) {
      return {
        url: `${prefix}/boards/${board.id}/files/${
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
