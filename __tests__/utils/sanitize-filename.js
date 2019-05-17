const sanitizeFilename = require('../../src/utils/sanitize-filename');

describe('Sanitize filename util', () => {
  it('strips emojis from a filename', () => {
    expect(sanitizeFilename('We are on fire🔥.jpg😍')).toBe(
      'We are on fire.jpg'
    );
  });

  it('strips control characters from a filename', () => {
    expect(sanitizeFilename('../\u0000')).toBe('');
  });

  it('should keep chinese characters', () => {
    expect(sanitizeFilename('北京市.jpg')).toBe('北京市.jpg');
  });

  it('should keep russian characters', () => {
    expect(sanitizeFilename('москва.ru')).toBe('москва.ru');
  });

  it('should convert undefined into an empty string', () => {
    expect(sanitizeFilename()).toBe('');
  });
});
