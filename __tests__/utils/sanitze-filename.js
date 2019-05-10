const sanitizeFilename = require('../../src/utils/sanitize-filename');

describe('sanitizeFilename method', () => {
  it('should remove emojis from filename', () => {
    expect(sanitizeFilename('🇯🇵japan.😢jpg')).toBe('japan.jpg');
  });

  it('should remove invalid character from filename', () => {
    expect(sanitizeFilename('~/.\u0000ssh/authorized_keys')).toBe(
      '~.sshauthorized_keys'
    );
  });

  it('should return an empty filename if not value is provided', () => {
    expect(sanitizeFilename()).toBe('');
  });
});
