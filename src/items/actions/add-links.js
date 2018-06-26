module.exports = function({ sendItems, futureLink, RemoteLink }) {
  /**
   * Add links to an existing transfer.
   * @param   {Object}  transfer Existing transfer object
   * @param   {Array}   links    A collection of links to be added to the transfer
   * @returns {Promise}          A collection of created items
   */
  return async function addLinks(transfer, links) {
    const transferItems = (await sendItems(
      transfer,
      links.map(futureLink)
    )).map((item) => new RemoteLink(item));

    transfer.addItems(...transferItems);

    return transferItems;
  };
};
