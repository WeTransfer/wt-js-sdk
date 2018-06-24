module.exports = function({ sendItems, futureFile, RemoteFile }) {
  /**
   * Add files to an existing transfer.
   * @param   {Object}  transfer Existing transfer object
   * @param   {Array}   files    A collection of files to be added to the transfer
   * @returns {Promise}          A collection of created items
   */
  return async function addFiles(transfer, files) {
    const transferItems = (await sendItems(
      transfer,
      files.map(futureFile)
    )).map((item) => new RemoteFile(item));

    transfer.addItems(...transferItems);

    return transferItems;
  };
};
