const logger = require('../../src/config/logger');

describe('Logger configuration', () => {
  let log;
  beforeEach(() => {
    logger.setLoggerLevel('info');
    log = jest.spyOn(console._stdout, 'write').mockImplementation(() => {
      /* don't console.log anything */
    });
  });

  afterEach(() => {
    log.mockRestore();
  });

  describe('when silly level is set', () => {
    it('should log silly logs', () => {
      logger.setLoggerLevel('silly');
      logger.silly('This is a silly log');
      expect(log.mock.calls[log.mock.calls.length - 1]).toMatchSnapshot();
    });
  });

  describe('when error level is set', () => {
    it('should NOT log silly logs', () => {
      logger.setLoggerLevel('error');
      logger.silly('This is a silly log');
      expect(log).not.toHaveBeenCalled();
    });
  });

  describe('when setting a level that doesn\'t exist', () => {
    it('should keep default info level', () => {
      logger.setLoggerLevel('yolo');
      expect(log.mock.calls[log.mock.calls.length - 1]).toMatchSnapshot();
      expect(logger.transports[0].level).toBe('info');
    });
  });

  describe('when setting an empty level', () => {
    it('should keep default info level', () => {
      expect(logger.transports[0].level).toBe('info');
      logger.setLoggerLevel();
      expect(log.mock.calls[log.mock.calls.length - 1]).toMatchSnapshot();
      expect(logger.transports[0].level).toBe('info');
    });
  });
});
