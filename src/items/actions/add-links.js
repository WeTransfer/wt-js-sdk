module.exports = function({ request, routes, futureLink, RemoteLink }) {
  function normalizeResponseItem(item) {
    return new RemoteLink(item);
  }

  const sendItems = require('./send-items')({ request, routes });

  return async function addFiles(transfer, links) {
    const transferItems = (await sendItems(
      transfer,
      links.map(futureLink)
    )).map(normalizeResponseItem);

    transfer.addItems(...transferItems);

    return transferItems;
  };
};
