module.exports = function(apiKey) {
  return {
    async authorize() {
      return apiKey;
    }
  };
};
