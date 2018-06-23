module.exports = function({ request, routes, futureFile, RemoteFile }) {
  function normalizeResponseItem(item) {
    return new RemoteFile(item);
  }

  const sendItems = require('./send-items')({ request, routes });

  return async function addFiles(transfer, files) {
    const transferItems = (await sendItems(
      transfer,
      files.map(futureFile)
    )).map(normalizeResponseItem);

    transfer.addItems(...transferItems);

    return transferItems;
  };
};
