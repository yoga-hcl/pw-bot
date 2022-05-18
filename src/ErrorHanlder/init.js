const constants = require('./constants');
const log4js = require('log4js');
const logger = log4js.getLogger('ERRHANDL');

module.exports = {
  start: () => {
    //logger.info(constants.errConfig);
  },
  stop: () => {
    logger.info('error handler shutdown !');
  }
};