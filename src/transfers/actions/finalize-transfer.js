module.exports = function({ request, routes }) {
  /**
   * Marks the transfer as completed
   * @param   {Object} transfer Transfer item.
   * @returns {Promise}
   */
  return function finalizeTransfer(transfer) {
    return request.send(routes.transfers.finalize(transfer));
  };
};
