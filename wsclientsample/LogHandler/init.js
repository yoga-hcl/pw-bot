const log4js = require('log4js');
const constants = require('./constants');

module.exports = {
  logger: log4js, 
  start: () => {
    log4js.configure(constants.logConfig);
  },
  stop: () => {
    log4js.shutdown(function() {
      console.log('log4js shutdown !');
    });
  }
};

