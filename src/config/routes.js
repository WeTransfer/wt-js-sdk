const prefix = '/v2';

module.exports = {
  prefix: '/v2',
  get authorize() {
    return { url: `${prefix}/authorize`, method: 'post' };
  },
  boards: {
    get create() {
      return { url: `${prefix}/boards`, method: 'post' };
    },
    find(boardId) {
      return { url: `${prefix}/boards/${boardId}`, method: 'get' };
    },
    addFiles(board) {
      return { url: `${prefix}/boards/${board.id}/files`, method: 'post' };
    },
    addLinks(board) {
      return { url: `${prefix}/boards/${board.id}/links`, method: 'post' };
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
      return { url: uploadUrl, method: 'post' };
    },
    uploadComplete(board, file) {
      return {
        url: `${prefix}/boards/${board.id}/files/${file.id}/upload-complete`,
        method: 'put',
      };
    },
  },
  transfers: {
    get create() {
      return { url: `${prefix}/transfers`, method: 'post' };
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
      return { url: uploadUrl, method: 'post' };
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
