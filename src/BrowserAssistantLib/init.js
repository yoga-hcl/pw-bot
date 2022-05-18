const log4js = require('log4js');
const BrowserBot = require('./common/browserbot');

const logger = log4js.getLogger('BOTAPP');

module.exports = {
  start: () => {
    logger.trace(`Starting a 'BrowserBot' instance.`);
    return BrowserBot.init();
  },
  stop: () => {
    logger.trace(`Stopping a 'BrowserBot' instance.`);
    return BrowserBot.deinit();
  },
}
