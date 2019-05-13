const config = require('../../src/config');

describe('Default configuration', () => {
  it('should match defined configuration', () => {
    expect(config).toMatchSnapshot();
  });
});
